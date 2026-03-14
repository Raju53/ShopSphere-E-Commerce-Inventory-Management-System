package com.inventory.inventory_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many cart items → One user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Many cart items → One product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
}