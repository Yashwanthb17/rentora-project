package com.rental.rentalmanagement.repository;

import com.rental.rentalmanagement.entity.RentalAgreement;
import com.rental.rentalmanagement.entity.enums.AgreementStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RentalAgreementRepo extends JpaRepository<RentalAgreement, Long> {

    List<RentalAgreement> findByTenantId(Long tenantId);

    List<RentalAgreement> findByUnitId(Long unitId);

    Optional<RentalAgreement> findByUnitIdAndStatus(
            Long unitId,
            AgreementStatus status
    );

    List<RentalAgreement> findByTenantIdAndStatus(
            Long tenantId,
            AgreementStatus status
    );

    List<RentalAgreement> findByStatus(AgreementStatus status);

    Optional<RentalAgreement> findByTenantIdAndUnitIdAndStatus(
            Long tenantId,
            Long unitId,
            AgreementStatus status
    );
}