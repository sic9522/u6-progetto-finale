package com.example.u6_progetto_finale.payloads.response;

import java.math.BigDecimal;

public record GeocodeResponse(BigDecimal latitude, BigDecimal longitude, String formattedAddress) {
}
