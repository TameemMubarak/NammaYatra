package com.nammayatra.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "booking_seats",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_booking_journey_seat",
            columnNames = {"booking_id", "journey_seat_id"}
        )
    }
)
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "journey_seat_id", nullable = false)
    private JourneySeat journeySeat;

    public BookingSeat() {}

    public Long getId() {
        return id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public JourneySeat getJourneySeat() {
        return journeySeat;
    }

    public void setJourneySeat(JourneySeat journeySeat) {
        this.journeySeat = journeySeat;
    }
}
