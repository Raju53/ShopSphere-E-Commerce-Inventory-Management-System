package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.dto.UserManagementDTO;
import com.inventory.inventory_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserManagementDTO>> getAllUsers() {
        // This provides the data for both UserDetails.jsx and SupplierDetails.jsx
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userServices.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not delete user");
        }
    }
}
