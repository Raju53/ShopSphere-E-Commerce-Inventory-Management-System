package com.inventory.inventory_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Long totalProducts; // Specific for Suppliers
    private Long totalOrders; // Specific for Users
}
