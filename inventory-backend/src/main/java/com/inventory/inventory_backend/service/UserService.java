package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public User updateProfile(String username, User profileUpdates) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String rawNumber = profileUpdates.getPhoneNumber();

        if (rawNumber != null && rawNumber.replaceAll("\\D", "").length() < 10) {
            throw new RuntimeException("Phone number must contain at least 10 digits");
        }
        // We do NOT update email or username here as they are fixed from registration
        user.setPhoneNumber(rawNumber);
        user.setAddress(profileUpdates.getAddress());
        user.setDob(profileUpdates.getDob());
        user.setCompanyName(profileUpdates.getCompanyName());

        return userRepository.save(user);
    }
}
