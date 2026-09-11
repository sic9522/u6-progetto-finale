package com.example.u6_progetto_finale.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.u6_progetto_finale.payloads.response.DocumentResponse;
import com.example.u6_progetto_finale.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

	private final DocumentService documentService;

	public DocumentController(DocumentService documentService) {
		this.documentService = documentService;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public DocumentResponse upload(@RequestParam("file") MultipartFile file) {
		return documentService.upload(file);
	}

	@GetMapping
	public List<DocumentResponse> list() {
		return documentService.listForDefaultUser();
	}

	@GetMapping("/{id}")
	public DocumentResponse get(@PathVariable UUID id) {
		return documentService.get(id);
	}

	/** Il file cosi' com'e' stato caricato: per visualizzarlo (immagine) o scaricarlo (PDF). */
	@GetMapping("/{id}/content")
	public ResponseEntity<byte[]> content(@PathVariable UUID id) {
		return documentService.readContent(id);
	}

}
