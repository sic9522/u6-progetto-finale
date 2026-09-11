package com.example.u6_progetto_finale.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.u6_progetto_finale.entities.Document;

public interface DocumentRepository extends JpaRepository<Document, UUID> {

	List<Document> findByUserId(UUID userId);

}
