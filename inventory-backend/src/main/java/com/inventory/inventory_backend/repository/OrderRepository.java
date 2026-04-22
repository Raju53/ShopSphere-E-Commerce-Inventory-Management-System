package com.inventory.inventory_backend.repository;

import com.inventory.inventory_backend.entity.Order;
import com.inventory.inventory_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    // FIX: Fetch the order along with items and products to avoid 500 LazyInit
    // errors
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    Long countByUser(User user);
}
