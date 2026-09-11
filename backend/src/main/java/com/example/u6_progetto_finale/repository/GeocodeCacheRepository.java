package com.example.u6_progetto_finale.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.u6_progetto_finale.entities.GeocodeCacheEntry;
import com.example.u6_progetto_finale.entities.GeocodeKind;

public interface GeocodeCacheRepository extends JpaRepository<GeocodeCacheEntry, UUID> {

	Optional<GeocodeCacheEntry> findByKindAndCacheKey(GeocodeKind kind, String cacheKey);

}
