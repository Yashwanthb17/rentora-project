package com.rental.rentalmanagement.entity;

import com.rental.rentalmanagement.entity.enums.UnitStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(
        name = "units",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_unit_property_unit_number",
                columnNames = {"property_id", "unit_number"}
        )
)
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String unitNumber;

    private BigDecimal monthlyRent;

    private BigDecimal securityDeposit;

    @Enumerated(EnumType.STRING)
    private UnitStatus status;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
}
