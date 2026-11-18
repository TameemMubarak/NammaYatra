package com.nammayatra.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateJourneyRequest(

        @NotNull(message = "Bus ID is required")
        Long busId,

        @NotBlank(message = "Source is required")
        String source,

        @NotBlank(message = "Destination is required")
        String destination,

        @NotNull(message = "Departure date and time are required")
        LocalDateTime departureDateTime,

        @NotNull(message = "Arrival date and time are required")
        LocalDateTime arrivalDateTime,

        @NotNull(message = "Fare is required")
        @DecimalMin(value = "0.01", message = "Fare must be greater than zero")
        BigDecimal fare

) {}
