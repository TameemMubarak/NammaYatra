package com.nammayatra.service;

import com.nammayatra.entity.Bus;
import com.nammayatra.repository.BusRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    // CREATE BUS
    @Transactional
    public Bus addBus(Bus bus) {

        String busNumber = bus.getBusNumber()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (busRepository.existsByBusNumber(busNumber)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Bus number already exists"
            );
        }

        validateBus(bus);

        bus.setBusNumber(busNumber);
        bus.setSource(bus.getSource().trim());
        bus.setDestination(bus.getDestination().trim());
        bus.setOperatorName(bus.getOperatorName().trim());
        bus.setActive(true);

        return busRepository.save(bus);
    }

    // READ ALL BUSES
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    // READ ACTIVE BUSES
    public List<Bus> getActiveBuses() {
        return busRepository.findByActiveTrue();
    }

    // READ BUS BY ID
    public Bus getBusById(Long id) {

        return busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bus not found"
                ));
    }

    // UPDATE BUS
    @Transactional
    public Bus updateBus(Long id, Bus updatedBus) {

        Bus existingBus = getBusById(id);

        if (!existingBus.getBusNumber()
                .equalsIgnoreCase(updatedBus.getBusNumber().trim())) {

            if (busRepository.existsByBusNumber(
                    updatedBus.getBusNumber().trim().toUpperCase(Locale.ROOT))) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Bus number already exists"
                );
            }
        }

        validateBus(updatedBus);

        existingBus.setBusNumber(
                updatedBus.getBusNumber().trim().toUpperCase(Locale.ROOT));

        existingBus.setOperatorName(updatedBus.getOperatorName().trim());
        existingBus.setSource(updatedBus.getSource().trim());
        existingBus.setDestination(updatedBus.getDestination().trim());
        existingBus.setDepartureTime(updatedBus.getDepartureTime());
        existingBus.setArrivalTime(updatedBus.getArrivalTime());
        existingBus.setTotalSeats(updatedBus.getTotalSeats());
        existingBus.setFare(updatedBus.getFare());

        return busRepository.save(existingBus);
    }

//re activate bus 
@Transactional
public Bus activateBus(Long id) {
    Bus bus = busRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Bus not found"
            ));

    bus.setActive(true);
    return busRepository.save(bus);
}

    // DEACTIVATE BUS
    @Transactional
    public void deactivateBus(Long id) {


        Bus bus = getBusById(id);
        bus.setActive(false);

        busRepository.save(bus);
    }

    // BUSINESS VALIDATION
    private void validateBus(Bus bus) {

        if (bus.getSource().trim()
                .equalsIgnoreCase(bus.getDestination().trim())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Source and destination cannot be the same"
            );
        }

        if (bus.getTotalSeats() == null || bus.getTotalSeats() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Total seats must be greater than zero"
            );
        }

        if (bus.getFare() == null ||
                bus.getFare().signum() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fare must be greater than zero"
            );
        }
    }
}
