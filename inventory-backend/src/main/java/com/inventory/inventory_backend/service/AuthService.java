package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.dto.*;
import com.inventory.inventory_backend.entity.*;
import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.repository.UserRepository;
import com.inventory.inventory_backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public String register(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username exists");
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email exists");

        // Map String role to Enum
        Role role = Role.ROLE_USER;
        if (request.getRole() != null) {
            try {
                String roleStr = request.getRole().toString();
                role = Role
                        .valueOf(roleStr.startsWith("ROLE_") ? roleStr.toUpperCase() : "ROLE_" + roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                role = Role.ROLE_USER; // Default fallback
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Ensure jwtUtils is called with the UserDetails or Username as per your
        // JwtUtils implementation
        String token = jwtUtils.generateToken(userDetails.getUsername());

        // Extract role from UserDetails authorities
        String userRole = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_USER");

        return new AuthResponse(token, userDetails.getUsername(), userRole);
    }

}