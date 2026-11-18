package com.nammayatra.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateBookingRequest(

        @NotNull(message = "Journey ID is required")
        Long journeyId,

        @NotEmpty(message = "Select at least one seat")
        List<@NotNull(message = "Seat ID cannot be null") Long> seatIds

) {}

