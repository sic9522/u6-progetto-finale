package com.example.u6_progetto_finale.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.u6_progetto_finale.config.DataSeeder;
import com.example.u6_progetto_finale.config.DocumentUploadProperties;
import com.example.u6_progetto_finale.entities.Document;
import com.example.u6_progetto_finale.entities.User;
import com.example.u6_progetto_finale.exceptions.BadRequestException;
import com.example.u6_progetto_finale.exceptions.NotFoundException;
import com.example.u6_progetto_finale.payloads.response.DocumentResponse;
import com.example.u6_progetto_finale.repository.DocumentRepository;
import com.example.u6_progetto_finale.repository.UserRepository;

@Service
@EnableConfigurationProperties(DocumentUploadProperties.class)
public class DocumentService {

	private static final Set<String> ALLOWED_TYPES = Set.of("image/png", "image/jpeg", "application/pdf");

	/** Solo le immagini vengono passate a Tesseract: un PDF servirebbe convertito pagina per pagina, fuori scope per ora. */
	private static final Set<String> OCR_TYPES = Set.of("image/png", "image/jpeg");

	private final DocumentRepository documentRepository;
	private final UserRepository userRepository;
	private final FileStorage fileStorage;
	private final OcrService ocrService;
	private final DocumentUploadProperties properties;
	private final Path documentsDir;

	public DocumentService(DocumentRepository documentRepository, UserRepository userRepository,
			FileStorage fileStorage, OcrService ocrService, DocumentUploadProperties properties) {
		this.documentRepository = documentRepository;
		this.userRepository = userRepository;
		this.fileStorage = fileStorage;
		this.ocrService = ocrService;
		this.properties = properties;
		this.documentsDir = Path.of(properties.dir()).toAbsolutePath();
	}

	public DocumentResponse upload(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new BadRequestException("nessun file ricevuto");
		}
		if (file.getSize() > properties.maxFileSizeBytes()) {
			throw new BadRequestException("il file supera la dimensione massima di " + properties.maxFileSizeBytes() + " byte");
		}

		byte[] content = MultipartFiles.readBytes(file);
		String realType = FileTypeCheck.detect(content);
		if (realType == null || !ALLOWED_TYPES.contains(realType)) {
			throw new BadRequestException("formato non ammesso (sono accettati PNG, JPEG e PDF)");
		}

		User author = defaultUser();
		String storageKey = fileStorage.save(documentsDir, content, extensionOf(realType));
		Document document = new Document(author, storageKey, MultipartFiles.safeName(file.getOriginalFilename()), realType, content.length);
		if (OCR_TYPES.contains(realType)) {
			document.setExtractedText(ocrService.extract(content));
		}

		return DocumentResponse.from(documentRepository.save(document));
	}

	public List<DocumentResponse> listForDefaultUser() {
		return documentRepository.findByUserId(defaultUser().getId()).stream().map(DocumentResponse::from).toList();
	}

	public DocumentResponse get(UUID id) {
		return documentRepository.findById(id)
			.map(DocumentResponse::from)
			.orElseThrow(() -> new NotFoundException("documento " + id + " non trovato"));
	}

	public ResponseEntity<byte[]> readContent(UUID id) {
		Document document = documentRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("documento " + id + " non trovato"));
		try {
			byte[] content = Files.readAllBytes(documentsDir.resolve(document.getStorageKey()));
			return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(document.getContentType()))
				.body(content);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	private User defaultUser() {
		return userRepository.findByUsername(DataSeeder.DEFAULT_USERNAME)
			.orElseThrow(() -> new NotFoundException("utente di default non trovato"));
	}

	private String extensionOf(String contentType) {
		return switch (contentType) {
			case "image/png" -> ".png";
			case "image/jpeg" -> ".jpg";
			case "application/pdf" -> ".pdf";
			default -> "";
		};
	}

}
