package com.nammayatra.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/passenger")
public class PassengerController {

    @GetMapping("/profile")
    public Map<String, Object> getProfile(Authentication authentication) {

        return Map.of(
                "message", "Passenger profile accessed successfully",
                "email", authentication.getName(),
                "authorities", authentication.getAuthorities()
        );
    }
}
