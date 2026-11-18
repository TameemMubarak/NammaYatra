package com.nammayatra.repository;

import com.nammayatra.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReferenceAndPassengerId(
            String bookingReference,
            Long passengerId
    );

    List<Booking> findByPassengerIdOrderByBookedAtDesc(
            Long passengerId
    );
}
