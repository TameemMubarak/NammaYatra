package com.nammayatra.dto;

import com.nammayatra.enums.SeatStatus;

public record SeatResponse(
        Long seatId,
        Long journeyId,
        String seatNumber,
        SeatStatus status
) {}
