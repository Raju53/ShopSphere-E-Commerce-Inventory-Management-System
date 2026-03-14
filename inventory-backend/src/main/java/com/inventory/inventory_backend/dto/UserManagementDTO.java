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
    private Integer totalProducts; // Specific for Suppliers
    private Integer totalOrders; // Specific for Users
}