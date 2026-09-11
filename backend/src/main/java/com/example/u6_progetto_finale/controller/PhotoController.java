package com.example.u6_progetto_finale.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.u6_progetto_finale.service.PostService;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

	private final PostService postService;

	public PhotoController(PostService postService) {
		this.postService = postService;
	}

	/** Il file della foto cosi' com'e' stato caricato, per mostrarlo nel feed. */
	@GetMapping("/{id}/content")
	public ResponseEntity<byte[]> content(@PathVariable UUID id) {
		return postService.readPhotoContent(id);
	}

}
