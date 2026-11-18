package com.nammayatra.repository;

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
}
