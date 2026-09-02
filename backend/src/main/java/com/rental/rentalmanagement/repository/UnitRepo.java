package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitRepo extends JpaRepository<Unit, Long> {
}
