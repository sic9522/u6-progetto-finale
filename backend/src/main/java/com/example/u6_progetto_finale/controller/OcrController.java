package com.example.u6_progetto_finale.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.u6_progetto_finale.payloads.response.OcrResponse;
import com.example.u6_progetto_finale.service.OcrService;

/** Estrazione testo al volo da una foto (es. per la descrizione di un post), senza salvare nulla. */
@RestController
@RequestMapping("/api/ocr")
public class OcrController {

	private final OcrService ocrService;

	public OcrController(OcrService ocrService) {
		this.ocrService = ocrService;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public OcrResponse extract(@RequestParam("file") MultipartFile file) {
		return new OcrResponse(ocrService.extractFromUpload(file));
	}

}
