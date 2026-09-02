package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepo extends JpaRepository<Property, Long> {
}
