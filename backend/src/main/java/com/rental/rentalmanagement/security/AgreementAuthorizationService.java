package com.rental.rentalmanagement.security;

import com.rental.rentalmanagement.repository.RentalAgreementRepo;
import org.springframework.stereotype.Service;

@Service
public class AgreementAuthorizationService {

    private final RentalAgreementRepo rentalAgreementRepo;
    private final CurrentUserService currentUserService;

    public AgreementAuthorizationService(
            RentalAgreementRepo rentalAgreementRepo,
            CurrentUserService currentUserService) {

        this.rentalAgreementRepo = rentalAgreementRepo;
        this.currentUserService = currentUserService;
    }

    public boolean isParticipant(Long agreementId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return rentalAgreementRepo.findById(agreementId)
                .map(agreement -> {

                    boolean isTenant =
                            agreement.getTenant()
                                    .getId()
                                    .equals(currentUserId);

                    boolean isOwner =
                            agreement.getUnit()
                                    .getProperty()
                                    .getOwner()
                                    .getId()
                                    .equals(currentUserId);

                    return isTenant || isOwner;
                })
                .orElse(false);
    }


    public boolean isAgreementOwner(Long agreementId) {

        Long currentUserId =
                currentUserService.getCurrentUserId();

        return rentalAgreementRepo.findById(agreementId)
                .map(agreement ->
                        agreement.getUnit()
                                .getProperty()
                                .getOwner()
                                .getId()
                                .equals(currentUserId)
                )
                .orElse(false);
    }
}