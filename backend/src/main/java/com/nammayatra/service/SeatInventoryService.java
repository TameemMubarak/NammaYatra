package com.nammayatra.service;


import java.util.Comparator; 

import com.nammayatra.dto.SeatResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


import com.nammayatra.repository.JourneyRepository;

import com.nammayatra.entity.Journey;
import com.nammayatra.entity.JourneySeat;
import com.nammayatra.enums.SeatStatus;
import com.nammayatra.repository.JourneySeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;

@Service
public class SeatInventoryService {

    private final JourneySeatRepository journeySeatRepository;
private final JourneyRepository journeyRepository;


	public SeatInventoryService(
        JourneySeatRepository journeySeatRepository,
        JourneyRepository journeyRepository) {

    this.journeySeatRepository = journeySeatRepository;
    this.journeyRepository = journeyRepository;
}

@Transactional
public void initializeExistingJourneys() {

    List<Journey> journeys = journeyRepository.findAll();

    for (Journey journey : journeys) {
        ensureSeatsCreated(journey);
    }

    System.out.println(
            "Existing journey seat inventories initialized."
    );
}

    @Transactional
    public void ensureSeatsCreated(Journey journey) {

        int totalSeats = journey.getBus().getTotalSeats();

        List<JourneySeat> existingSeats =
                journeySeatRepository
                        .findByJourneyIdOrderBySeatNumberAsc(journey.getId());

        Set<String> existingSeatNumbers = new HashSet<>();

        for (JourneySeat seat : existingSeats) {
            existingSeatNumbers.add(seat.getSeatNumber());
        }

        List<JourneySeat> newSeats = new ArrayList<>();

        for (int seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {

            String number = String.valueOf(seatNumber);

            if (existingSeatNumbers.contains(number)) {
                continue;
            }

            JourneySeat seat = new JourneySeat();
            seat.setJourney(journey);
            seat.setSeatNumber(number);
            seat.setStatus(SeatStatus.AVAILABLE);

            newSeats.add(seat);
        }

        if (!newSeats.isEmpty()) {
            journeySeatRepository.saveAll(newSeats);
        }
    }

@Transactional(readOnly = true)
public List<SeatResponse> getSeatsForJourney(Long journeyId) {

    if (!journeyRepository.existsById(journeyId)) {
        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Journey not found"
        );
    }

    return journeySeatRepository
        .findByJourneyIdOrderBySeatNumberAsc(journeyId)
        .stream()
        .sorted(Comparator.comparingInt(
                seat -> Integer.parseInt(seat.getSeatNumber())
        ))
        .map(seat -> new SeatResponse(
                seat.getId(),
                seat.getJourney().getId(),
                seat.getSeatNumber(),
                seat.getStatus()
        ))
        .toList();
}
}
