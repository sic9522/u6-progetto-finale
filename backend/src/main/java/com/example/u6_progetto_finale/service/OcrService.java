package com.example.u6_progetto_finale.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Estrazione del testo da un'immagine tramite Tesseract (tess4j).
 *
 * Non solleva mai un'eccezione verso chi chiama: se l'OCR fallisce (immagine
 * illeggibile, Tesseract non disponibile) il documento viene comunque salvato,
 * semplicemente senza testo estratto.
 */
@Component
public class OcrService {

	private static final Logger log = LoggerFactory.getLogger(OcrService.class);

	private final ObjectProvider<Tesseract> tesseractProvider;

	public OcrService(ObjectProvider<Tesseract> tesseractProvider) {
		this.tesseractProvider = tesseractProvider;
	}

	public String extract(byte[] imageContent) {
		Tesseract tesseract = tesseractProvider.getObject();
		try {
			BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(imageContent));
			if (decoded == null) {
				log.warn("OCR saltato: formato immagine non decodificabile");
				return null;
			}
			String text = tesseract.doOCR(decoded);
			return text == null ? null : text.strip();
		} catch (TesseractException | IOException e) {
			log.warn("OCR non riuscito: {}", e.getMessage());
			return null;
		}
	}

}
