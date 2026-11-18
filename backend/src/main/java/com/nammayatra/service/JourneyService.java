package com.nammayatra.service;


import com.nammayatra.dto.JourneySearchResponse;
import java.time.LocalDate;
import java.util.Locale;

import com.nammayatra.dto.CreateJourneyRequest;
import com.nammayatra.entity.Bus;
import com.nammayatra.entity.Journey;
import com.nammayatra.repository.BusRepository;
import com.nammayatra.repository.JourneyRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final BusRepository busRepository;
	private final SeatInventoryService seatInventoryService;

	public JourneyService(
        JourneyRepository journeyRepository,
        BusRepository busRepository,
        SeatInventoryService seatInventoryService) {

    this.journeyRepository = journeyRepository;
    this.busRepository = busRepository;
    this.seatInventoryService = seatInventoryService;
}

    
 // CREATE JOURNEY
    @Transactional
    public Journey createJourney(CreateJourneyRequest request) {

        // 1. Find the bus
        Bus bus = busRepository.findById(request.busId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bus not found"
                ));

        // 2. Check whether bus is active
        if (!Boolean.TRUE.equals(bus.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This bus is currently inactive"
            );
        }

        // 3. Validate source and destination
        String source = request.source().trim();
        String destination = request.destination().trim();

        if (source.equalsIgnoreCase(destination)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Source and destination cannot be the same"
            );
        }

        // 4. Validate departure and arrival
        LocalDateTime departure = request.departureDateTime();
        LocalDateTime arrival = request.arrivalDateTime();

        if (!departure.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Departure must be in the future"
            );
        }

        if (!arrival.isAfter(departure)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Arrival must be after departure"
            );
        }

        // 5. Check overlapping journeys
        boolean overlapping = journeyRepository
                .existsByBusIdAndDepartureDateTimeLessThanAndArrivalDateTimeGreaterThan(
                        bus.getId(),
                        arrival,
                        departure
                );

        if (overlapping) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This bus already has a journey during this time"
            );
        }

        // 6. Create journey
        Journey journey = new Journey();

        journey.setBus(bus);
        journey.setSource(source);
        journey.setDestination(destination);
        journey.setDepartureDateTime(departure);
        journey.setArrivalDateTime(arrival);
        journey.setFare(request.fare());
        journey.setActive(true);

        Journey savedJourney = journeyRepository.save(journey);

seatInventoryService.ensureSeatsCreated(savedJourney);

return savedJourney;
    }

    // GET ALL JOURNEYS
    public List<Journey> getAllJourneys() {
        return journeyRepository.findAll();
    }

    // GET JOURNEY BY ID
    public Journey getJourneyById(Long id) {

        return journeyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Journey not found"
                ));
    }

	public List<JourneySearchResponse> searchJourneys(
        String source,
        String destination,
        LocalDate date) {

    if (source == null || source.isBlank()
            || destination == null || destination.isBlank()) {

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Source and destination are required"
        );
    }

    if (date == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Travel date is required"
        );
    }

    String cleanSource = source.trim();
    String cleanDestination = destination.trim();

    if (cleanSource.equalsIgnoreCase(cleanDestination)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Source and destination cannot be the same"
        );
    }

    LocalDateTime start = date.atStartOfDay();
    LocalDateTime end = date.plusDays(1).atStartOfDay();
    LocalDateTime now = LocalDateTime.now();

    List<Journey> journeys =
            journeyRepository.searchAvailableJourneys(
                    cleanSource,
                    cleanDestination,
                    start,
                    end,
                    now
            );

    return journeys.stream()
            .map(journey -> new JourneySearchResponse(
                    journey.getId(),
                    journey.getBus().getId(),
                    journey.getBus().getBusNumber(),
                    journey.getBus().getOperatorName(),
                    journey.getSource(),
                    journey.getDestination(),
                    journey.getDepartureDateTime(),
                    journey.getArrivalDateTime(),
                    journey.getFare(),
                    journey.getBus().getTotalSeats()
            ))
            .toList();
}
}
