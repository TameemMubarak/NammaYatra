package com.nammayatra.config;

import com.nammayatra.entity.User;
import com.nammayatra.enums.Role;
import com.nammayatra.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.name:NammaYatra Admin}")
    private String adminName;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Value("${app.admin.phone:}")
    private String adminPhone;

    public AdminAccountInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Do not create an admin unless credentials are supplied.
        if (adminEmail.isBlank() && adminPassword.isBlank()) {
            System.out.println("Admin initialization skipped.");
            return;
        }

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            throw new IllegalStateException(
                    "Both ADMIN_EMAIL and ADMIN_PASSWORD are required.");
        }

        if (adminPassword.length() < 12) {
            throw new IllegalStateException(
                    "Admin password must contain at least 12 characters.");
        }

        String email = adminEmail.trim().toLowerCase(Locale.ROOT);

        var existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {

            if (existingUser.get().getRole() != Role.ADMIN) {
                throw new IllegalStateException(
                        "This email already belongs to a non-admin account.");
            }

            System.out.println("Admin account already exists.");
            return;
        }

        User admin = new User();

        admin.setName(adminName.trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setPhone(adminPhone);
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        System.out.println("Admin account created successfully.");
    }
}

