package com.nammayatra.dto;

import com.nammayatra.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(

        String bookingReference,
        Long journeyId,
        String source,
        String destination,
        List<String> seatNumbers,
        BigDecimal totalAmount,
        BookingStatus status,
        LocalDateTime bookedAt

) {}
