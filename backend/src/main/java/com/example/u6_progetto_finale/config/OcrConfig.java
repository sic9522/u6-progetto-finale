package com.example.u6_progetto_finale.config;

import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
@EnableConfigurationProperties(OcrProperties.class)
public class OcrConfig {

	/**
	 * Un'istanza di Tesseract non e' utilizzabile da piu' thread contemporaneamente:
	 * con lo scope prototype se ne ottiene una nuova a ogni richiesta.
	 */
	@Bean
	@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
	Tesseract tesseract(OcrProperties properties) {
		Tesseract tesseract = new Tesseract();
		tesseract.setDatapath(properties.tessdataPath());
		tesseract.setLanguage(properties.language());
		return tesseract;
	}

}
