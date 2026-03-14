package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.entity.Order;
import com.inventory.inventory_backend.dto.OrderResponse;
import com.inventory.inventory_backend.dto.OrderStatusRequest;
import com.inventory.inventory_backend.entity.OrderStatus;
import com.inventory.inventory_backend.repository.OrderRepository;
import com.inventory.inventory_backend.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        // Fetches every order in the system regardless of user
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/{orderId}")
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusRequest request) {

        if (request == null || request.getStatus() == null) {
            throw new RuntimeException("Status string is missing in request body");
        }
        try {
            // Use trim() to remove accidental spaces
            OrderStatus status = OrderStatus.valueOf(request.getStatus().trim().toUpperCase());
            return orderService.updateOrderStatus(orderId, status);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid status. Valid values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED");
        }
    }
}