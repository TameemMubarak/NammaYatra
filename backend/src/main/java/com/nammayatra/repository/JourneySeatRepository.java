package com.nammayatra.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.nammayatra.entity.JourneySeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JourneySeatRepository
        extends JpaRepository<JourneySeat, Long> {

    List<JourneySeat> findByJourneyIdOrderBySeatNumberAsc(Long journeyId);

    boolean existsByJourneyIdAndSeatNumber(
            Long journeyId,
            String seatNumber
    );

    long countByJourneyId(Long journeyId);

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT s
    FROM JourneySeat s
    WHERE s.id IN :seatIds
      AND s.journey.id = :journeyId
    ORDER BY s.id
    """)
List<JourneySeat> findSeatsForUpdate(
        @Param("journeyId") Long journeyId,
        @Param("seatIds") List<Long> seatIds
);


}
