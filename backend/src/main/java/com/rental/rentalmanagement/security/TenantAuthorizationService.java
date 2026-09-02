package com.rental.rentalmanagement.security;

import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.repository.MaintenanceRequestRepo;
import com.rental.rentalmanagement.repository.PaymentRepo;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.repository.TerminationRequestRepo;
import org.springframework.stereotype.Service;

@Service
public class TenantAuthorizationService {

    private final PaymentRepo paymentRepo;
    private final CurrentUserService currentUserService;
    private final RentalAgreementRepo rentalAgreementRepo;
    private final MaintenanceRequestRepo maintenanceRequestRepo;
    private final TerminationRequestRepo terminationRequestRepo;

    public TenantAuthorizationService(
            PaymentRepo paymentRepo,
            CurrentUserService currentUserService, RentalAgreementRepo rentalAgreementRepo, MaintenanceRequestRepo maintenanceRequestRepo, TerminationRequestRepo terminationRequestRepo) {

        this.paymentRepo = paymentRepo;
        this.currentUserService = currentUserService;
        this.rentalAgreementRepo = rentalAgreementRepo;
        this.maintenanceRequestRepo = maintenanceRequestRepo;
        this.terminationRequestRepo = terminationRequestRepo;
    }

    public boolean isPaymentOwner(Long paymentId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return paymentRepo.findById(paymentId)
                .map(payment ->
                        payment.getAgreement()
                                .getTenant()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isTenantOfUnit(Long unitId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return rentalAgreementRepo
                .findByTenantIdAndUnitIdAndStatus(
                        currentUserId,
                        unitId,
                        AgreementStatus.ACTIVE
                )
                .isPresent();
    }

    public boolean isMaintenanceTenant(Long requestId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return maintenanceRequestRepo.findById(requestId)
                .map(request ->
                        request.getTenant()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }

    public boolean isTerminationRequestTenant(Long terminationRequestId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return terminationRequestRepo.findById(terminationRequestId)
                .map(request ->
                        request.getAgreement()
                                .getTenant()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }
}