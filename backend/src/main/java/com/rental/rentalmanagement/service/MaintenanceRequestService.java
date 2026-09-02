package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.CreateMaintenanceRequest;
import com.rental.rentalmanagement.dto.response.MaintenanceResponse;
import com.rental.rentalmanagement.entity.MaintenanceRequest;
import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.Unit;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.entity.enums.MaintenanceStatus;
import com.rental.rentalmanagement.exception.BusinessRuleException;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.MaintenanceRequestRepo;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.repository.UnitRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepo maintenanceRequestRepo;
    private final UnitRepo unitRepo;
    private final RentalAgreementRepo rentalAgreementRepo;
    private final CurrentUserService currentUserService;

    public MaintenanceRequestService(
            MaintenanceRequestRepo maintenanceRequestRepo,
            UnitRepo unitRepo,
            RentalAgreementRepo rentalAgreementRepo, CurrentUserService currentUserService) {

        this.maintenanceRequestRepo = maintenanceRequestRepo;
        this.unitRepo = unitRepo;
        this.rentalAgreementRepo = rentalAgreementRepo;
        this.currentUserService = currentUserService;
    }

    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    @Transactional
    public MaintenanceResponse createRequest(CreateMaintenanceRequest request) {

        Long tenantId = currentUserService.getCurrentUserId();

        Unit unit = unitRepo.findById(request.unitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Unit not found with ID: "
                                        + request.unitId()
                        ));

        RentalAgreement agreement =
                rentalAgreementRepo
                        .findByTenantIdAndUnitIdAndStatus(
                                tenantId,
                                request.unitId(),
                                AgreementStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new BusinessRuleException(
                                        "Tenant does not rent this unit"
                                ));

        MaintenanceRequest maintenanceRequest =
                MaintenanceRequest.builder()
                        .unit(unit)
                        .tenant(agreement.getTenant())
                        .title(request.title())
                        .description(request.description())
                        .priority(request.priority())
                        .status(MaintenanceStatus.OPEN)
                        .createdAt(LocalDateTime.now())
                        .build();

        return toResponse(
                maintenanceRequestRepo.save(maintenanceRequest)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isMaintenanceOwner(#requestId)"
    )    @Transactional
    public MaintenanceResponse startRequest(Long requestId) {

        MaintenanceRequest request =
                maintenanceRequestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Maintenance request not found with ID: "
                                                + requestId
                                ));

        if (request.getStatus() != MaintenanceStatus.OPEN) {
            throw new BusinessRuleException(
                    "Only open requests can be started"
            );
        }

        request.setStatus(MaintenanceStatus.IN_PROGRESS);

        return toResponse(
                maintenanceRequestRepo.save(request)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isMaintenanceOwner(#requestId)"
    )    @Transactional
    public MaintenanceResponse resolveRequest(Long requestId) {

        MaintenanceRequest request =
                maintenanceRequestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Maintenance request not found with ID: "
                                                + requestId
                                ));

        if (request.getStatus() != MaintenanceStatus.IN_PROGRESS) {
            throw new BusinessRuleException(
                    "Only requests in progress can be resolved"
            );
        }

        request.setStatus(MaintenanceStatus.RESOLVED);
        request.setResolvedAt(LocalDateTime.now());

        return toResponse(
                maintenanceRequestRepo.save(request)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isMaintenanceOwner(#requestId) or " +
                    "@tenantAuthorizationService.isMaintenanceTenant(#requestId)"
    )
    @Transactional
    public MaintenanceResponse cancelRequest(Long requestId) {

        MaintenanceRequest request =
                maintenanceRequestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Maintenance request not found with ID: "
                                                + requestId
                                ));

        if (request.getStatus() == MaintenanceStatus.RESOLVED) {
            throw new BusinessRuleException(
                    "Resolved requests cannot be cancelled"
            );
        }

        if (request.getStatus() == MaintenanceStatus.CANCELLED) {
            throw new BusinessRuleException(
                    "Request is already cancelled"
            );
        }

        request.setStatus(MaintenanceStatus.CANCELLED);

        return toResponse(
                maintenanceRequestRepo.save(request)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isMaintenanceOwner(#requestId) or " +
                    "@tenantAuthorizationService.isMaintenanceTenant(#requestId)"
    )
    public MaintenanceResponse getRequestById(Long id) {

        MaintenanceRequest request =
                maintenanceRequestRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Maintenance request not found with ID: "
                                                + id
                                ));

        return toResponse(request);
    }

    @PreAuthorize("hasRole('TENANT')")
    public List<MaintenanceResponse> getRequestsByTenant() {

        Long tenantId = currentUserService.getCurrentUserId();
        return maintenanceRequestRepo.findByTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isUnitOwner(#unitId)"
    )
    public List<MaintenanceResponse> getRequestsByUnit(
            Long unitId) {

        return maintenanceRequestRepo.findByUnitId(unitId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private MaintenanceResponse toResponse(
            MaintenanceRequest request) {

        return new MaintenanceResponse(
                request.getId(),
                request.getUnit().getId(),
                request.getTenant().getId(),
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getResolvedAt()
        );
    }
}