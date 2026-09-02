package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.PaymentRequest;
import com.rental.rentalmanagement.dto.response.PaymentResponse;
import com.rental.rentalmanagement.entity.Payment;
import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import com.rental.rentalmanagement.entity.enums.PaymentMethod;
import com.rental.rentalmanagement.entity.enums.PaymentStatus;
import com.rental.rentalmanagement.exception.BusinessRuleException;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.PaymentRepo;
import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final RentalAgreementRepo rentalAgreementRepo;
    private final CurrentUserService currentUserService;

    public PaymentService(
            PaymentRepo paymentRepo,
            RentalAgreementRepo rentalAgreementRepo, CurrentUserService currentUserService) {

        this.paymentRepo = paymentRepo;
        this.rentalAgreementRepo = rentalAgreementRepo;
        this.currentUserService = currentUserService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public PaymentResponse generatePayment(Long agreementId) {

        RentalAgreement agreement = rentalAgreementRepo.findById(agreementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rental agreement not found with ID: " + agreementId
                        ));

        if (agreement.getStatus() != AgreementStatus.ACTIVE) {
            throw new BusinessRuleException(
                    "Cannot generate payment for an inactive agreement"
            );
        }

        LocalDate billingPeriod =
                LocalDate.now().withDayOfMonth(1);

        boolean exists = paymentRepo.existsByAgreementIdAndBillingPeriod(
                agreementId,
                billingPeriod
        );

        if (exists) {
            throw new BusinessRuleException(
                    "Payment already generated for this billing period"
            );
        }

        Payment payment = Payment.builder()
                .agreement(agreement)
                .amount(agreement.getMonthlyRent())
                .billingPeriod(billingPeriod)
                .dueDate(billingPeriod.plusDays(4))
                .status(PaymentStatus.PENDING)
                .build();

        return toResponse(paymentRepo.save(payment));
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@tenantAuthorizationService.isPaymentOwner(#paymentId)"
    )    @Transactional
    public PaymentResponse payPayment(
            Long paymentId,
            PaymentMethod paymentMethod,
            String transactionReference) {

        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + paymentId
                        ));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BusinessRuleException(
                    "Payment has already been paid"
            );
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionReference(transactionReference);

        return toResponse(paymentRepo.save(payment));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void generateMonthlyPayments() {

        List<RentalAgreement> activeAgreements =
                rentalAgreementRepo.findByStatus(
                        AgreementStatus.ACTIVE
                );

        LocalDate billingPeriod =
                LocalDate.now().withDayOfMonth(1);

        for (RentalAgreement agreement : activeAgreements) {

            boolean alreadyExists =
                    paymentRepo.existsByAgreementIdAndBillingPeriod(
                            agreement.getId(),
                            billingPeriod
                    );

            if (alreadyExists) {
                continue;
            }

            Payment payment = Payment.builder()
                    .agreement(agreement)
                    .amount(agreement.getMonthlyRent())
                    .billingPeriod(billingPeriod)
                    .dueDate(billingPeriod.plusDays(4))
                    .status(PaymentStatus.PENDING)
                    .build();

            paymentRepo.save(payment);
        }
    }

    @Transactional
    public void markOverduePayments() {

        List<Payment> overduePending =
                paymentRepo.findByStatusAndDueDateBefore(
                        PaymentStatus.PENDING,
                        LocalDate.now()
                );

        for (Payment payment : overduePending) {
            payment.setStatus(PaymentStatus.OVERDUE);
        }

        paymentRepo.saveAll(overduePending);
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@tenantAuthorizationService.isPaymentOwner(#id)"
    )
    public PaymentResponse getPaymentById(Long id) {

        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        ));

        return toResponse(payment);
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@agreementAuthorizationService.isParticipant(#agreementId)"
    )
    public List<PaymentResponse> getPaymentsByAgreement(
            Long agreementId) {

        return paymentRepo.findByAgreementId(agreementId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PreAuthorize("hasRole('TENANT')")
    public List<PaymentResponse> getPaymentsByTenant() {

        Long tenantId = currentUserService.getCurrentUserId();
        return paymentRepo.findByAgreementTenantId(tenantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PaymentResponse toResponse(Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getAgreement().getId(),
                payment.getAmount(),
                payment.getBillingPeriod(),
                payment.getDueDate(),
                payment.getPaymentDate(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getTransactionReference()
        );
    }
}