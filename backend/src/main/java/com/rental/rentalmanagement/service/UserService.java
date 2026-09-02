package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.UserRequest;
import com.rental.rentalmanagement.dto.response.UserResponse;
import com.rental.rentalmanagement.entity.User;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.UserRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder, CurrentUserService currentUserService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
    }

    public UserResponse createUser(UserRequest request){
        return userToUserResponse(
                userRepo.save(
                        userRequestToUser(request)
                )
        );
    }

    public UserResponse getCurrentUser() {
        Long currentUserId = currentUserService.getCurrentUserId();
        return userToUserResponse(fetchUser(currentUserId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers(){
        return userRepo.findAll()
                .stream()
                .map(this::userToUserResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserById(Long id){
        return userToUserResponse(fetchUser(id));
    }

    // Shared, unguarded lookup. @PreAuthorize is not enforced on internal
    // (same-class) calls, so getCurrentUser() deliberately routes through
    // this helper instead of the ADMIN-only getUserById() to avoid relying
    // on that self-invocation quirk.
    private User fetchUser(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private User userRequestToUser(UserRequest request){
        return User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(request.role())
                .active(true)
                .build();
    }

    private UserResponse userToUserResponse(User user){
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive()
        );
    }

}
