package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.dto.UserManagementDTO;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.repository.UserRepository;
import com.inventory.inventory_backend.repository.ProductRepository;
import com.inventory.inventory_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

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

    public List<UserManagementDTO> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(this::convertToManagementDTO)
                .collect(Collectors.toList());
    }

    public List<UserManagementDTO> getAllSuppliersForAdmin() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equals("ROLE_SUPPLIER"))
                .map(this::convertToManagementDTO)
                .collect(Collectors.toList());
    }

    private UserManagementDTO convertToManagementDTO(User user) {
        UserManagementDTO.UserManagementDTOBuilder builder = UserManagementDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name());

        // Conditional counting based on role
        if ("ROLE_SUPPLIER".equals(user.getRole().name())) {
            builder.totalProducts(productRepository.countBySupplierId(user.getId()));
        } else if ("ROLE_USER".equals(user.getRole().name())) {
            // Assuming you've added countByUser to OrderRepository
            builder.totalOrders(orderRepository.countByUser(user));
        }

        return builder.build();
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
