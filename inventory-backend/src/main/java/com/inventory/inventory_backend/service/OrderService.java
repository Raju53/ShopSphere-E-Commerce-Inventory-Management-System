package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.dto.OrderItemResponse;
import com.inventory.inventory_backend.dto.OrderResponse;
import com.inventory.inventory_backend.entity.*;
import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Matches OrderController -> getMyOrders
    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUser(user).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional
    public OrderResponse placeOrder(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Cart> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty())
            throw new RuntimeException("Cart is empty");

        double totalPrice = 0;
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (Cart cart : cartItems) {
            Product product = cart.getProduct();
            if (product.getStock() < cart.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            product.setStock(product.getStock() - cart.getQuantity());
            productRepository.save(product);

            totalPrice += product.getPrice() * cart.getQuantity();

            orderItems.add(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cart.getQuantity())
                    .price(product.getPrice())
                    .build());
        }

        order.setTotalPrice(totalPrice);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteAll(cartItems);

        return mapToOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return mapToOrderResponse(orderRepository.save(order));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(i -> OrderItemResponse.builder()
                        .productName(i.getProduct().getName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }

    // For the Customer
    @Transactional
    public void cancelOrder(Long orderId, String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        // 🛡️ Return stock to inventory
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    // For the Supplier
    public void shipOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).get();
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);
    }
}