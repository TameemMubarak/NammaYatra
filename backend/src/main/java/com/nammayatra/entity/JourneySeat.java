package com.nammayatra.entity;

import com.nammayatra.enums.SeatStatus;
import jakarta.persistence.*;

@Entity
@Table(
    name = "journey_seats",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_journey_seat_number",
            columnNames = {"journey_id", "seat_number"}
        )
    }
)
public class JourneySeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "journey_id", nullable = false)
    private Journey journey;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;

    public JourneySeat() {}

    public Long getId() {
        return id;
    }

    public Journey getJourney() {
        return journey;
    }

    public void setJourney(Journey journey) {
        this.journey = journey;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public SeatStatus getStatus() {
        return status;
    }

    public void setStatus(SeatStatus status) {
        this.status = status;
    }
}
