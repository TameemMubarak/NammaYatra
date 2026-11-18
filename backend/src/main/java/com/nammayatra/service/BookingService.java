package com.nammayatra.service;

import com.nammayatra.dto.BookingResponse;
import com.nammayatra.dto.CreateBookingRequest;

import com.nammayatra.entity.Booking;
import com.nammayatra.entity.BookingSeat;
import com.nammayatra.entity.Journey;
import com.nammayatra.entity.JourneySeat;
import com.nammayatra.entity.User;

import com.nammayatra.enums.BookingStatus;
import com.nammayatra.enums.SeatStatus;

import com.nammayatra.repository.BookingRepository;
import com.nammayatra.repository.BookingSeatRepository;
import com.nammayatra.repository.JourneyRepository;
import com.nammayatra.repository.JourneySeatRepository;
import com.nammayatra.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final JourneyRepository journeyRepository;
    private final JourneySeatRepository journeySeatRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            JourneyRepository journeyRepository,
            JourneySeatRepository journeySeatRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.journeyRepository = journeyRepository;
        this.journeySeatRepository = journeySeatRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(
            String passengerEmail,
            CreateBookingRequest request) {

        // 1. Validate selected seats.

        List<Long> requestedSeatIds = request.seatIds();

        if (requestedSeatIds == null || requestedSeatIds.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Select at least one seat");
        }

        Set<Long> uniqueSeatIds = new HashSet<>(requestedSeatIds);

        if (uniqueSeatIds.size() != requestedSeatIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Duplicate seat IDs are not allowed");
        }

        // 2. Find the authenticated passenger.

        String email = passengerEmail.trim().toLowerCase(Locale.ROOT);

        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Passenger account not found"));

        if (passenger.getRole() != com.nammayatra.enums.Role.PASSENGER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only passengers can create bookings");
        }

        // 3. Find and validate the journey.

        Journey journey = journeyRepository.findById(request.journeyId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Journey not found"));

        if (!Boolean.TRUE.equals(journey.getActive())
                || !Boolean.TRUE.equals(journey.getBus().getActive())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This journey is not available for booking");
        }

        if (!journey.getDepartureDateTime().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This journey has already departed");
        }

        // 4. Lock the selected seats in the database.

        List<JourneySeat> selectedSeats =
                journeySeatRepository.findSeatsForUpdate(
                        journey.getId(),
                        requestedSeatIds
                );

        if (selectedSeats.size() != requestedSeatIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "One or more seats do not belong to this journey");
        }

        // 5. Verify every seat is available.

        for (JourneySeat seat : selectedSeats) {

            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Seat " + seat.getSeatNumber()
                                + " is no longer available");
            }
        }

        // 6. Calculate the total amount on the backend.

        BigDecimal totalAmount = journey.getFare()
                .multiply(BigDecimal.valueOf(selectedSeats.size()));

        // 7. Create the booking.

        Booking booking = new Booking();
        booking.setPassenger(passenger);
        booking.setJourney(journey);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        // 8. Connect the booking with its seats.

        List<BookingSeat> bookingSeats = new ArrayList<>();
        List<String> seatNumbers = new ArrayList<>();

        for (JourneySeat seat : selectedSeats) {

            seat.setStatus(SeatStatus.BOOKED);

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(savedBooking);
            bookingSeat.setJourneySeat(seat);

            bookingSeats.add(bookingSeat);
            seatNumbers.add(seat.getSeatNumber());
        }

        bookingSeatRepository.saveAll(bookingSeats);

        // 9. Return a safe response DTO.

        return new BookingResponse(
                savedBooking.getBookingReference(),
                journey.getId(),
                journey.getSource(),
                journey.getDestination(),
                seatNumbers,
                totalAmount,
                savedBooking.getStatus(),
                savedBooking.getBookedAt()
        );
    }
}
