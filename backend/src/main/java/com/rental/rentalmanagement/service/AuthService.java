package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.LoginRequest;
import com.rental.rentalmanagement.dto.response.LoginResponse;
import com.rental.rentalmanagement.entity.User;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final UserRepo userRepo;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtEncoder jwtEncoder, UserRepo userRepo) {

        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.userRepo = userRepo;
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                );

        User user = userRepo.findByEmail(request.email())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60))
                .build();

        String token =
                jwtEncoder.encode(
                        JwtEncoderParameters.from(claims)
                ).getTokenValue();

        return new LoginResponse(token);
    }
}