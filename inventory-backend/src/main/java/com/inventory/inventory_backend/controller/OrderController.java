package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.dto.OrderResponse;
import com.inventory.inventory_backend.entity.OrderStatus;
import com.inventory.inventory_backend.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Place Order
    @PostMapping
    public OrderResponse placeOrder(Authentication authentication) {

        return orderService.placeOrder(authentication.getName());
    }

    // View Orders
    @GetMapping
    public List<OrderResponse> getMyOrders(Authentication authentication) {

        return orderService.getUserOrders(authentication.getName());
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId, Authentication auth) {
        orderService.cancelOrder(orderId, auth.getName());
        return ResponseEntity.ok("Order cancelled successfully");
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Status updated to " + status);
    }
}