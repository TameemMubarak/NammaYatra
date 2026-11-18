package com.nammayatra.controller;

import com.nammayatra.dto.CreateJourneyRequest;
import com.nammayatra.entity.Journey;
import com.nammayatra.service.JourneyService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/journeys")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    // CREATE JOURNEY
    @PostMapping
    public ResponseEntity<Journey> createJourney(
            @Valid @RequestBody CreateJourneyRequest request) {

        Journey journey = journeyService.createJourney(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(journey);
    }

    // GET ALL JOURNEYS
    @GetMapping
    public ResponseEntity<List<Journey>> getAllJourneys() {

        return ResponseEntity.ok(
                journeyService.getAllJourneys()
        );
    }

    // GET JOURNEY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Journey> getJourneyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                journeyService.getJourneyById(id)
        );
    }
}
