package com.rental.rentalmanagement.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        // JSON numeric claims can be deserialized as Integer or Long depending
        // on the parser, so cast via Number rather than assuming Long directly
        // (a direct cast risks a ClassCastException at runtime).
        Number userId = jwt.getClaim("userId");
        return userId.longValue();
    }

    public String getCurrentUserRole() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        return jwt.getClaimAsString("role");
    }

    public String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        return jwt.getSubject();
    }
}