package com.nammayatra.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record JourneySearchResponse(

        Long journeyId,
        Long busId,
        String busNumber,
        String operatorName,

        String source,
        String destination,

        LocalDateTime departureDateTime,
        LocalDateTime arrivalDateTime,

        BigDecimal fare,
        Integer totalSeats

) {}
