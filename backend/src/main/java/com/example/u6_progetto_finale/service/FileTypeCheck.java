package com.example.u6_progetto_finale.service;

import java.util.Arrays;

/**
 * Il tipo dichiarato dal client (Content-Type dell'header multipart) e' solo
 * un'indicazione, non una garanzia: i primi byte del file dicono qual e' il
 * formato reale.
 */
public final class FileTypeCheck {

	private static final byte[] PNG = { (byte) 0x89, 'P', 'N', 'G' };
	private static final byte[] JPEG = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF };
	private static final byte[] PDF = { '%', 'P', 'D', 'F' };

	private FileTypeCheck() {
	}

	/** Restituisce il content-type reale, oppure null se il formato non e' tra quelli riconosciuti. */
	public static String detect(byte[] content) {
		if (startsWith(content, PNG)) {
			return "image/png";
		}
		if (startsWith(content, JPEG)) {
			return "image/jpeg";
		}
		if (startsWith(content, PDF)) {
			return "application/pdf";
		}
		return null;
	}

	private static boolean startsWith(byte[] content, byte[] signature) {
		return content.length >= signature.length
			&& Arrays.equals(Arrays.copyOf(content, signature.length), signature);
	}

}
