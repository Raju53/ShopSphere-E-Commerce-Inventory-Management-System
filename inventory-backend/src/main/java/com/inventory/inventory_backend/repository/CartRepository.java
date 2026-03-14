package com.inventory.inventory_backend.repository;

import com.inventory.inventory_backend.entity.Cart;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUser(User user);

    Optional<Cart> findByUserAndProduct(User user, Product product);
}