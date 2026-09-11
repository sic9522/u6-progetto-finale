package com.example.u6_progetto_finale.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.u6_progetto_finale.payloads.response.PostResponse;
import com.example.u6_progetto_finale.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

	private final PostService postService;

	public PostController(PostService postService) {
		this.postService = postService;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public PostResponse create(
			@RequestParam("files") MultipartFile[] files,
			@RequestParam(required = false) BigDecimal latitude,
			@RequestParam(required = false) BigDecimal longitude,
			@RequestParam(required = false) String address) {
		return postService.createPost(files, latitude, longitude, address);
	}

	@GetMapping
	public List<PostResponse> list() {
		return postService.listPosts();
	}

	@GetMapping("/{id}")
	public PostResponse get(@PathVariable UUID id) {
		return postService.getPost(id);
	}

}
