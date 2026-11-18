package com.nammayatra.controller;

import com.nammayatra.dto.SeatResponse;
import com.nammayatra.service.SeatInventoryService;
import org.springframework.web.bind.annotation.PathVariable;


import com.nammayatra.dto.JourneySearchResponse;
import com.nammayatra.service.JourneyService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/passenger")
public class PassengerController {

private final JourneyService journeyService;

private final SeatInventoryService seatInventoryService;

public PassengerController(JourneyService journeyService, SeatInventoryService seatInventoryService) {
    this.journeyService = journeyService;
this.seatInventoryService = seatInventoryService;
}


@GetMapping("/journeys/{journeyId}/seats")
public ResponseEntity<List<SeatResponse>> getJourneySeats(
        @PathVariable Long journeyId) {

    List<SeatResponse> seats =
            seatInventoryService.getSeatsForJourney(journeyId);

    return ResponseEntity.ok(seats);
}


    @GetMapping("/profile")
    public Map<String, Object> getProfile(Authentication authentication) {

        return Map.of(
                "message", "Passenger profile accessed successfully",
                "email", authentication.getName(),
                "authorities", authentication.getAuthorities()
        );
    }

@GetMapping("/journeys/search")
public ResponseEntity<List<JourneySearchResponse>> searchJourneys(

        @RequestParam String source,

        @RequestParam String destination,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date
) {

    List<JourneySearchResponse> journeys =
            journeyService.searchJourneys(source, destination, date);

    return ResponseEntity.ok(journeys);
}

}
