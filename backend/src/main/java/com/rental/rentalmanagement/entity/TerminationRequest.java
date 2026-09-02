package com.rental.rentalmanagement.entity;

import com.rental.rentalmanagement.entity.enums.TerminationRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "termination_requests")
public class TerminationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agreement_id", nullable = false)
    private RentalAgreement agreement;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private TerminationRequestStatus status;

    private LocalDateTime requestedAt;

    private LocalDateTime resolvedAt;
}
