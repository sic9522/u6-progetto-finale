package com.example.u6_progetto_finale.controller;

import java.math.BigDecimal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.u6_progetto_finale.payloads.response.GeocodeResponse;
import com.example.u6_progetto_finale.service.GeocodingService;

/** Il geocoding passa sempre dal server: il frontend non conosce la chiave usata qui. */
@RestController
@RequestMapping("/api/geocode")
public class GeocodeController {

	private final GeocodingService geocodingService;

	public GeocodeController(GeocodingService geocodingService) {
		this.geocodingService = geocodingService;
	}

	/** GET /api/geocode?address=Via Roma 1, Milano */
	@GetMapping
	public GeocodeResponse geocode(@RequestParam String address) {
		return geocodingService.geocode(address);
	}

	/** GET /api/geocode/reverse?latitude=&longitude= */
	@GetMapping("/reverse")
	public GeocodeResponse reverse(@RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude) {
		return geocodingService.reverseGeocode(latitude, longitude);
	}

}
