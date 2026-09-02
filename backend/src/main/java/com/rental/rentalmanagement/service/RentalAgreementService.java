package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.response.RentalAgreementResponse;
import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.Unit;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.entity.enums.UnitStatus;
import com.rental.rentalmanagement.exception.BusinessRuleException;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalAgreementService {

    private final RentalAgreementRepo agreementRepo;
    private final CurrentUserService currentUserService;

    public RentalAgreementService(RentalAgreementRepo agreementRepo, CurrentUserService currentUserService) {
        this.agreementRepo = agreementRepo;
        this.currentUserService = currentUserService;
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@agreementAuthorizationService.isAgreementOwner(#id)"
    )
    @Transactional
    public RentalAgreementResponse terminateAgreement(Long id) {

        RentalAgreement agreement =
                agreementRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Rental agreement not found with ID: " + id
                                ));

        if (agreement.getStatus() != AgreementStatus.ACTIVE) {
            throw new BusinessRuleException(
                    "Only active agreements can be terminated"
            );
        }

        agreement.setStatus(AgreementStatus.TERMINATED);
        agreement.setEndDate(LocalDate.now());

        agreement.getUnit().setStatus(UnitStatus.AVAILABLE);

        return toResponse(
                agreementRepo.save(agreement)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@agreementAuthorizationService.isParticipant(#id)"
    )
    public RentalAgreementResponse getAgreementById(Long id) {

        RentalAgreement agreement =
                agreementRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Rental agreement not found with ID: " + id
                                ));

        return toResponse(agreement);
    }

    @PreAuthorize("hasRole('TENANT')")
    public List<RentalAgreementResponse> getAgreementsByTenant(){
        Long tenantId = currentUserService.getCurrentUserId();
        return agreementRepo.findByTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isUnitOwner(#unitId)"
    )
    public List<RentalAgreementResponse> getAgreementsByUnit(Long unitId){
        return agreementRepo.findByUnitId(unitId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private RentalAgreementResponse toResponse(
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
