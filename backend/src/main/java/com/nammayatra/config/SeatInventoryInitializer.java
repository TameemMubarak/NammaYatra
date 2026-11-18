package com.nammayatra.config;

import com.nammayatra.service.SeatInventoryService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SeatInventoryInitializer implements CommandLineRunner {

    private final SeatInventoryService seatInventoryService;

    public SeatInventoryInitializer(
            SeatInventoryService seatInventoryService) {

        this.seatInventoryService = seatInventoryService;
    }

    @Override
    public void run(String... args) {

        seatInventoryService.initializeExistingJourneys();
    }
}
