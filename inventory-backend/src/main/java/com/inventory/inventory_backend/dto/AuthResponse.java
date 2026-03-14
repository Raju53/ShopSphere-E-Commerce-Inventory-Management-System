package com.inventory.inventory_backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private String role;
}