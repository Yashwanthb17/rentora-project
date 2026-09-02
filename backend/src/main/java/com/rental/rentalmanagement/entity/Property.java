package com.rental.rentalmanagement.entity;

import com.rental.rentalmanagement.entity.enums.PropertyType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;

    private String city;

    private String state;

    private String pincode;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Builder.Default
    private boolean verified = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
