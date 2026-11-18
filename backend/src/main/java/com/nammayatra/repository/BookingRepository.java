package com.nammayatra.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT b
    FROM Booking b
    WHERE b.bookingReference = :reference
      AND b.passenger.id = :passengerId
    """)
Optional<Booking> findForCancellation(
        @Param("reference") String reference,
        @Param("passengerId") Long passengerId
);

}
