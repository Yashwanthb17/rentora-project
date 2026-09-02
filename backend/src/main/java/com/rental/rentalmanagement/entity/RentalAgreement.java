package com.rental.rentalmanagement.entity;

import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "rental_agreements")
public class RentalAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal monthlyRent;

    private BigDecimal securityDeposit;

    @Enumerated(EnumType.STRING)
    private AgreementStatus status;
}