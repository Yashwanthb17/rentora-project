package com.rental.rentalmanagement.entity;

import com.rental.rentalmanagement.entity.enums.MaintenancePriority;
import com.rental.rentalmanagement.entity.enums.MaintenanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private MaintenancePriority priority;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;
}