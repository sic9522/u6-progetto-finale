package com.example.u6_progetto_finale.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.u6_progetto_finale.config.DataSeeder;
import com.example.u6_progetto_finale.config.PhotoUploadProperties;
import com.example.u6_progetto_finale.entities.Photo;
import com.example.u6_progetto_finale.entities.Post;
import com.example.u6_progetto_finale.entities.User;
import com.example.u6_progetto_finale.exceptions.BadRequestException;
import com.example.u6_progetto_finale.exceptions.NotFoundException;
import com.example.u6_progetto_finale.payloads.response.PostResponse;
import com.example.u6_progetto_finale.repository.PhotoRepository;
import com.example.u6_progetto_finale.repository.PostRepository;
import com.example.u6_progetto_finale.repository.UserRepository;

@Service
@EnableConfigurationProperties(PhotoUploadProperties.class)
public class PostService {

	/** Uniche foto accettate per un post: le slide chiedono foto, non documenti generici. */
	private static final Set<String> ALLOWED_PHOTO_TYPES = Set.of("image/png", "image/jpeg");

	private final PostRepository postRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final FileStorage fileStorage;
	private final PhotoUploadProperties properties;
	private final Path photosDir;

	public PostService(PostRepository postRepository, PhotoRepository photoRepository, UserRepository userRepository,
			FileStorage fileStorage, PhotoUploadProperties properties) {
		this.postRepository = postRepository;
		this.photoRepository = photoRepository;
		this.userRepository = userRepository;
		this.fileStorage = fileStorage;
		this.properties = properties;
		this.photosDir = Path.of(properties.dir()).toAbsolutePath();
	}

	public PostResponse createPost(MultipartFile[] files, BigDecimal latitude, BigDecimal longitude, String address) {
		validate(files);

		User author = userRepository.findByUsername(DataSeeder.DEFAULT_USERNAME)
			.orElseThrow(() -> new NotFoundException("utente di default non trovato"));

		Post post = new Post(author);
		post.setLatitude(latitude);
		post.setLongitude(longitude);
		post.setAddress(address == null || address.isBlank() ? null : address.strip());

		for (MultipartFile file : files) {
			byte[] content = MultipartFiles.readBytes(file);
			String contentType = FileTypeCheck.detect(content);
			String storageKey = fileStorage.save(photosDir, content, extensionOf(contentType));
			post.getPhotos().add(new Photo(post, storageKey, MultipartFiles.safeName(file.getOriginalFilename()), contentType, content.length));
		}

		return PostResponse.from(postRepository.save(post));
	}

	public List<PostResponse> listPosts() {
		return postRepository.findAll().stream().map(PostResponse::from).toList();
	}

	public PostResponse getPost(UUID id) {
		return postRepository.findById(id)
			.map(PostResponse::from)
			.orElseThrow(() -> new NotFoundException("post " + id + " non trovato"));
	}

	public ResponseEntity<byte[]> readPhotoContent(UUID photoId) {
		Photo photo = photoRepository.findById(photoId)
			.orElseThrow(() -> new NotFoundException("foto " + photoId + " non trovata"));
		try {
			byte[] content = Files.readAllBytes(photosDir.resolve(photo.getStorageKey()));
			return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(photo.getContentType()))
				.body(content);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	/** Prima si controlla tutto, poi si scrive: cosi' non restano file orfani se una foto non e' valida. */
	private void validate(MultipartFile[] files) {
		List<String> reasons = new ArrayList<>();

		if (files == null || files.length == 0) {
			reasons.add("nessuna foto ricevuta");
		} else if (files.length > properties.maxFiles()) {
			reasons.add("troppe foto: massimo " + properties.maxFiles());
		} else {
			for (MultipartFile file : files) {
				String name = MultipartFiles.safeName(file.getOriginalFilename());
				if (file.isEmpty()) {
					reasons.add(name + ": file vuoto");
					continue;
				}
				if (file.getSize() > properties.maxFileSizeBytes()) {
					reasons.add(name + ": supera la dimensione massima di " + properties.maxFileSizeBytes() + " byte");
					continue;
				}
				String realType = FileTypeCheck.detect(MultipartFiles.readBytes(file));
				if (realType == null || !ALLOWED_PHOTO_TYPES.contains(realType)) {
					reasons.add(name + ": formato non ammesso (sono accettati solo PNG e JPEG)");
				}
			}
		}

		if (!reasons.isEmpty()) {
			throw new BadRequestException(String.join("; ", reasons));
		}
	}

	private String extensionOf(String contentType) {
		return switch (contentType) {
			case "image/png" -> ".png";
			case "image/jpeg" -> ".jpg";
			default -> "";
		};
	}

}
