package com.nammayatra.dto;

import com.nammayatra.enums.BookingStatus;

public record CancellationResponse(
        String message,
        String bookingReference,
        BookingStatus status
) {}
