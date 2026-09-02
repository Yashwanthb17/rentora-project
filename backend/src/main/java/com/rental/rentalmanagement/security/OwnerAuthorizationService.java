package com.rental.rentalmanagement.security;

import com.rental.rentalmanagement.entity.Property;
import com.rental.rentalmanagement.repository.*;
import org.springframework.stereotype.Service;

@Service
public class OwnerAuthorizationService {

    private final PropertyRepo propertyRepo;
    private final CurrentUserService currentUserService;
    private final UnitRepo unitRepo;
    private final ApplicationRepo applicationRepo;
    private final MaintenanceRequestRepo maintenanceRequestRepo;
    private final TerminationRequestRepo terminationRequestRepo;

    public OwnerAuthorizationService(
            PropertyRepo propertyRepo,
            CurrentUserService currentUserService, UnitRepo unitRepo, ApplicationRepo applicationRepo, MaintenanceRequestRepo maintenanceRequestRepo, TerminationRequestRepo terminationRequestRepo) {

        this.propertyRepo = propertyRepo;
        this.currentUserService = currentUserService;
        this.unitRepo = unitRepo;
        this.applicationRepo = applicationRepo;
        this.maintenanceRequestRepo = maintenanceRequestRepo;
        this.terminationRequestRepo = terminationRequestRepo;
    }

    public boolean isPropertyOwner(Long propertyId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return propertyRepo.findById(propertyId)
                .map(property ->
                        property.getOwner().getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isUnitOwner(Long unitId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return unitRepo.findById(unitId)
                .map(unit ->
                        unit.getProperty()
                                .getOwner()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isApplicationOwner(Long applicationId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return applicationRepo.findById(applicationId)
                .map(application ->
                        application.getUnit()
                                .getProperty()
                                .getOwner()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isMaintenanceOwner(Long requestId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return maintenanceRequestRepo.findById(requestId)
                .map(request ->
                        request.getUnit()
                                .getProperty()
                                .getOwner()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isTerminationRequestOwner(Long terminationRequestId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return terminationRequestRepo.findById(terminationRequestId)
                .map(request ->
                        request.getAgreement()
                                .getUnit()
                                .getProperty()
                                .getOwner()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

}