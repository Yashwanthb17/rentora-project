package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.TerminationRequest;
import com.rental.rentalmanagement.entity.enums.TerminationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TerminationRequestRepo extends JpaRepository<TerminationRequest, Long> {

    List<TerminationRequest> findByAgreementId(Long agreementId);

    List<TerminationRequest> findByAgreementTenantId(Long tenantId);

    boolean existsByAgreementIdAndStatus(
            Long agreementId,
            TerminationRequestStatus status
    );
}
