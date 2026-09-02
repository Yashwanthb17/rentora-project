package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.TerminationRequestRequest;
import com.rental.rentalmanagement.dto.response.TerminationRequestResponse;
import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.TerminationRequest;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.entity.enums.TerminationRequestStatus;
import com.rental.rentalmanagement.entity.enums.UnitStatus;
import com.rental.rentalmanagement.exception.BusinessRuleException;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.repository.TerminationRequestRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TerminationRequestService {

    private final TerminationRequestRepo terminationRequestRepo;
    private final RentalAgreementRepo agreementRepo;
    private final CurrentUserService currentUserService;

    public TerminationRequestService(
            TerminationRequestRepo terminationRequestRepo,
            RentalAgreementRepo agreementRepo,
            CurrentUserService currentUserService) {

        this.terminationRequestRepo = terminationRequestRepo;
        this.agreementRepo = agreementRepo;
        this.currentUserService = currentUserService;
    }

    @PreAuthorize("hasRole('TENANT')")
    @Transactional
    public TerminationRequestResponse createRequest(
            TerminationRequestRequest request) {

        Long tenantId = currentUserService.getCurrentUserId();

        RentalAgreement agreement =
                agreementRepo.findById(request.agreementId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Rental agreement not found with ID: "
                                                + request.agreementId()
                                ));

        if (!agreement.getTenant().getId().equals(tenantId)) {
            throw new BusinessRuleException(
                    "You do not rent under this agreement"
            );
        }

        if (agreement.getStatus() != AgreementStatus.ACTIVE) {
            throw new BusinessRuleException(
                    "Only active agreements can have a termination requested"
            );
        }

        boolean alreadyPending =
                terminationRequestRepo.existsByAgreementIdAndStatus(
                        agreement.getId(),
                        TerminationRequestStatus.PENDING
                );

        if (alreadyPending) {
            throw new BusinessRuleException(
                    "A termination request is already pending for this agreement"
            );
        }

        TerminationRequest terminationRequest =
                TerminationRequest.builder()
                        .agreement(agreement)
                        .reason(request.reason())
                        .status(TerminationRequestStatus.PENDING)
                        .requestedAt(LocalDateTime.now())
                        .build();

        return toResponse(
                terminationRequestRepo.save(terminationRequest)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isTerminationRequestOwner(#id)"
    )
    @Transactional
    public TerminationRequestResponse approveRequest(Long id) {

        TerminationRequest terminationRequest =
                terminationRequestRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Termination request not found with ID: " + id
                                ));

        if (terminationRequest.getStatus() != TerminationRequestStatus.PENDING) {
            throw new BusinessRuleException(
                    "Only pending termination requests can be approved"
            );
        }

        RentalAgreement agreement = terminationRequest.getAgreement();

        if (agreement.getStatus() != AgreementStatus.ACTIVE) {
            throw new BusinessRuleException(
                    "Agreement is no longer active"
            );
        }

        agreement.setStatus(AgreementStatus.TERMINATED);
        agreement.setEndDate(LocalDate.now());
        agreement.getUnit().setStatus(UnitStatus.AVAILABLE);

        terminationRequest.setStatus(TerminationRequestStatus.APPROVED);
        terminationRequest.setResolvedAt(LocalDateTime.now());

        return toResponse(
                terminationRequestRepo.save(terminationRequest)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isTerminationRequestOwner(#id)"
    )
    @Transactional
    public TerminationRequestResponse rejectRequest(Long id) {

        TerminationRequest terminationRequest =
                terminationRequestRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Termination request not found with ID: " + id
                                ));

        if (terminationRequest.getStatus() != TerminationRequestStatus.PENDING) {
            throw new BusinessRuleException(
                    "Only pending termination requests can be rejected"
            );
        }

        terminationRequest.setStatus(TerminationRequestStatus.REJECTED);
        terminationRequest.setResolvedAt(LocalDateTime.now());

        return toResponse(
                terminationRequestRepo.save(terminationRequest)
        );
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isTerminationRequestOwner(#id) or " +
                    "@tenantAuthorizationService.isTerminationRequestTenant(#id)"
    )
    public TerminationRequestResponse getRequestById(Long id) {

        return toResponse(
                terminationRequestRepo.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Termination request not found with ID: " + id
                                ))
        );
    }

    @PreAuthorize("hasRole('TENANT')")
    public List<TerminationRequestResponse> getRequestsByTenant() {

        Long tenantId = currentUserService.getCurrentUserId();

        return terminationRequestRepo.findByAgreementTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@agreementAuthorizationService.isAgreementOwner(#agreementId)"
    )
    public List<TerminationRequestResponse> getRequestsByAgreement(
            Long agreementId) {

        return terminationRequestRepo.findByAgreementId(agreementId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TerminationRequestResponse toResponse(
            TerminationRequest terminationRequest) {

        return new TerminationRequestResponse(
                terminationRequest.getId(),
                terminationRequest.getAgreement().getId(),
                terminationRequest.getAgreement().getTenant().getId(),
                terminationRequest.getReason(),
                terminationRequest.getStatus(),
                terminationRequest.getRequestedAt(),
                terminationRequest.getResolvedAt()
        );
    }
}
