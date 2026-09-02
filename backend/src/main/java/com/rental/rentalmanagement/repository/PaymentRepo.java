package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.Payment;
import com.rental.rentalmanagement.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

    List<Payment> findByAgreementId(Long agreementId);

    List<Payment> findByAgreementTenantId(Long tenantId);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByStatusAndDueDateBefore(
            PaymentStatus status,
            LocalDate date
    );

    boolean existsByAgreementIdAndBillingPeriod(
            Long agreementId,
            LocalDate billingPeriod
    );
}