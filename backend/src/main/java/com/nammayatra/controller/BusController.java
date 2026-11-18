package com.nammayatra.controller;

import com.nammayatra.entity.Bus;
import com.nammayatra.service.BusService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    // CREATE BUS
    @PostMapping
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus) {

        Bus savedBus = busService.addBus(bus);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedBus);
    }

    // GET ALL BUSES
    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {

        return ResponseEntity.ok(
                busService.getAllBuses()
        );
    }

    // GET ACTIVE BUSES
    @GetMapping("/active")
    public ResponseEntity<List<Bus>> getActiveBuses() {

        return ResponseEntity.ok(
                busService.getActiveBuses()
        );
    }

    // GET BUS BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                busService.getBusById(id)
        );
    }

    // UPDATE BUS
    @PutMapping("/{id}")
    public ResponseEntity<Bus> updateBus(
            @PathVariable Long id,
            @RequestBody Bus bus) {

        return ResponseEntity.ok(
                busService.updateBus(id, bus)
        );
    }

    // DEACTIVATE BUS
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateBus(
            @PathVariable Long id) {

        busService.deactivateBus(id);

        return ResponseEntity.noContent().build();
    }
}

