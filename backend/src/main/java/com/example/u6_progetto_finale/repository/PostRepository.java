package com.example.u6_progetto_finale.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.u6_progetto_finale.entities.Post;

public interface PostRepository extends JpaRepository<Post, UUID> {
}
