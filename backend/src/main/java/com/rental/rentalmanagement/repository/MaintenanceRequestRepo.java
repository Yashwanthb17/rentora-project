package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.MaintenanceRequest;
import com.rental.rentalmanagement.entity.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepo
        extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findByTenantId(Long tenantId);

    List<MaintenanceRequest> findByUnitId(Long unitId);

    List<MaintenanceRequest> findByStatus(MaintenanceStatus status);
}