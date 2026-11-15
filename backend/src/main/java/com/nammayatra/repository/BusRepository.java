package com.nammayatra.repository;

import com.nammayatra.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Long> {

    boolean existsByBusNumber(String busNumber);

    List<Bus> findByActiveTrue();
}

