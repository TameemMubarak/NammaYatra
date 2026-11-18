package com.nammayatra.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nammayatra.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JourneyRepository extends JpaRepository<Journey, Long> {

    boolean existsByBusIdAndDepartureDateTime(
            Long busId,
            LocalDateTime departureDateTime
    );

    boolean existsByBusIdAndDepartureDateTimeLessThanAndArrivalDateTimeGreaterThan(
            Long busId,
            LocalDateTime arrivalDateTime,
            LocalDateTime departureDateTime
    );

    List<Journey> findByDepartureDateTimeBetweenAndActiveTrue(
            LocalDateTime start,
            LocalDateTime end
    );

	@Query("""
    SELECT j
    FROM Journey j
    JOIN FETCH j.bus b
    WHERE j.active = true
      AND b.active = true
      AND LOWER(j.source) = LOWER(:source)
      AND LOWER(j.destination) = LOWER(:destination)
      AND j.departureDateTime >= :start
      AND j.departureDateTime < :end
      AND j.departureDateTime > :now
    ORDER BY j.departureDateTime ASC
    """)
List<Journey> searchAvailableJourneys(
        @Param("source") String source,
        @Param("destination") String destination,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("now") LocalDateTime now
);
}
