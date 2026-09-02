package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.Application;
import com.rental.rentalmanagement.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<Application, Long> {

    boolean existsByTenantIdAndUnitIdAndStatus(
            Long tenantId,
            Long unitId,
            ApplicationStatus status
    );

    List<Application> findByTenantId(Long tenantId);

    List<Application> findByUnitId(Long unitId);
}