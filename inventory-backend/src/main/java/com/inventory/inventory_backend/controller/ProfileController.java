package com.inventory.inventory_backend.controller;

import jakarta.validation.Valid;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.repository.UserRepository;
import com.inventory.inventory_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody User profileData, Authentication auth) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), profileData));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        return ResponseEntity.ok(userRepository.findByUsername(auth.getName()).get());
    }
}
