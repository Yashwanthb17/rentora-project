package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.ApplicationRequest;
import com.rental.rentalmanagement.dto.response.ApplicationResponse;
import com.rental.rentalmanagement.dto.response.RentalAgreementResponse;
import com.rental.rentalmanagement.entity.Application;
import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.Unit;
import com.rental.rentalmanagement.entity.User;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.entity.enums.ApplicationStatus;
import com.rental.rentalmanagement.entity.enums.UnitStatus;
import com.rental.rentalmanagement.exception.BusinessRuleException;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.ApplicationRepo;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.repository.UnitRepo;
import com.rental.rentalmanagement.repository.UserRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final UserRepo userRepo;
    private final UnitRepo unitRepo;
    private final ApplicationRepo applicationRepo;
    private final RentalAgreementRepo rentalAgreementRepo;
    private final CurrentUserService currentUserService;

    public ApplicationService(UserRepo userRepo, UnitRepo unitRepo, ApplicationRepo applicationRepo, RentalAgreementRepo rentalAgreementRepo, CurrentUserService currentUserService) {
        this.userRepo = userRepo;
        this.unitRepo = unitRepo;
        this.applicationRepo = applicationRepo;
        this.rentalAgreementRepo = rentalAgreementRepo;
        this.currentUserService = currentUserService;
    }

    @PreAuthorize("hasRole('TENANT')")
    public ApplicationResponse createApplication(
            ApplicationRequest request
    ){
        Long tenantId = currentUserService.getCurrentUserId();

        //Making shore tenant Id is correct
        User tenant = userRepo.findById(tenantId)
                .orElseThrow(()-> new ResourceNotFoundException( "Tenant not found with ID: " + tenantId));

        //Making shore Unit Id is correct
        Unit unit = unitRepo.findById(request.unitId())
                .orElseThrow(()-> new ResourceNotFoundException( "Unit not found with ID: " + request.unitId()));

        //Checking if Unit status is available
        if(unit.getStatus() != UnitStatus.AVAILABLE){
            throw new BusinessRuleException(
                    "Unit is not available for application"
            );
        }

        boolean alreadyApplied =
                applicationRepo.existsByTenantIdAndUnitIdAndStatus(
                        tenantId,
                        request.unitId(),
                        ApplicationStatus.PENDING
                );

        if(alreadyApplied){
            throw new BusinessRuleException(
                    "You already have a pending application for this unit"
            );
        }

        return toResponse(
                applicationRepo.save(
                        Application.builder()
                                .tenant(tenant)
                                .unit(unit)
                                .message(request.message())
                                .status(ApplicationStatus.PENDING)
                                .appliedAt(LocalDateTime.now())
                                .build()
                )
        );
    }

    public ApplicationResponse getApplicationById(Long id){
        return toResponse(
                applicationRepo.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("Application not found with ID: "+id))
        );
    }

    public List<ApplicationResponse> getApplicationsByTenant(){
        Long tenantId = currentUserService.getCurrentUserId();

        return applicationRepo.findByTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByUnit(Long unitId){
        return applicationRepo.findByUnitId(unitId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ApplicationResponse toResponse(Application application) {

        return new ApplicationResponse(
                application.getId(),
                application.getTenant().getId(),
                application.getUnit().getId(),
                application.getMessage(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isApplicationOwner(#applicationId)"
    )
    @Transactional
    public RentalAgreementResponse approveApplication(Long applicationId) {

        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with ID: " + applicationId
                        ));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BusinessRuleException(
                    "Only pending applications can be approved"
            );
        }

        Unit unit = application.getUnit();

        if (unit.getStatus() != UnitStatus.AVAILABLE) {
            throw new BusinessRuleException(
                    "Unit is no longer available"
            );
        }

        application.setStatus(ApplicationStatus.APPROVED);

        unit.setStatus(UnitStatus.OCCUPIED);

        RentalAgreement agreement = RentalAgreement.builder()
                .application(application)
                .tenant(application.getTenant())
                .unit(unit)
                .startDate(LocalDate.now())
                .monthlyRent(unit.getMonthlyRent())
                .securityDeposit(unit.getSecurityDeposit())
                .status(AgreementStatus.ACTIVE)
                .build();

        RentalAgreement savedAgreement =
                rentalAgreementRepo.save(agreement);

        applicationRepo.save(application);
        unitRepo.save(unit);

        return toAgreementResponse(savedAgreement);
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isApplicationOwner(#applicationId)"
    )
    @Transactional
    public ApplicationResponse rejectApplication(Long applicationId) {

        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with ID: " + applicationId
                        ));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BusinessRuleException(
                    "Only pending applications can be rejected"
            );
        }

        application.setStatus(ApplicationStatus.REJECTED);

        return toResponse(applicationRepo.save(application));
    }

    private RentalAgreementResponse toAgreementResponse(
            RentalAgreement agreement) {

        return new RentalAgreementResponse(
                agreement.getId(),
                agreement.getApplication().getId(),
                agreement.getTenant().getId(),
                agreement.getUnit().getId(),
                agreement.getStartDate(),
                agreement.getEndDate(),
                agreement.getMonthlyRent(),
                agreement.getSecurityDeposit(),
                agreement.getStatus()
        );
    }
}
