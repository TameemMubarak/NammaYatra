package com.nammayatra.controller;

import java.util.List;

import com.nammayatra.dto.CancellationResponse;

import com.nammayatra.dto.BookingResponse;
import com.nammayatra.dto.CreateBookingRequest;
import com.nammayatra.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passenger/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }



    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {

        String passengerEmail = authentication.getName();

        BookingResponse response =
                bookingService.createBooking(passengerEmail, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

@GetMapping
public ResponseEntity<List<BookingResponse>> getMyBookings(
        Authentication authentication) {

    String passengerEmail = authentication.getName();

    List<BookingResponse> bookings =
            bookingService.getMyBookings(passengerEmail);

    return ResponseEntity.ok(bookings);
}

@DeleteMapping("/{bookingReference}")
public ResponseEntity<CancellationResponse> cancelBooking(
        @PathVariable String bookingReference,
        Authentication authentication) {

    String passengerEmail = authentication.getName();

    CancellationResponse response =
            bookingService.cancelBooking(
                    passengerEmail,
                    bookingReference
            );

    return ResponseEntity.ok(response);
}

}
