package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.dto.response.OrderItemResponse;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.entity.*;
import com.devteria.identityservice.enums.OrderStatus;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.OrderItemMapper;
import com.devteria.identityservice.mapper.OrderMapper;
import com.devteria.identityservice.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    UserRepository userRepository;
    ProductRepository productRepository;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    CartItemRepository cartItemRepository;
    OrderMapper orderMapper;
    OrderItemMapper orderItemMapper;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public OrderResponse buyNow(OrderRequest request) {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Order order = orderMapper.toOrder(user, product, request.getQuantity());
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        OrderItem orderItem = orderItemMapper.toOrderItem(product, request.getQuantity());
        orderItem.setOrder(order);
        orderItemRepository.save(orderItem);

        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setItems(List.of(orderItemMapper.toOrderItemResponse(orderItem)));
        return response;
    }

    public OrderResponse checkoutFromCart() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = user.getCart();
        if (cart == null || cart.getId() == null) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = orderMapper.toOrder(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        List<OrderItem> orderItems = cartItems.stream().map(item -> {
            OrderItem oi = orderItemMapper.toOrderItem(item.getProduct(), item.getQuantity());
            oi.setOrder(order);
            return oi;
        }).toList();

        orderItemRepository.saveAll(orderItems);
        cartItemRepository.deleteAll(cartItems);

        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setItems(orderItems.stream()
                .map(orderItemMapper::toOrderItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public List<OrderResponse> getOrdersByUser() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Order> orders = orderRepository.findByUserId(user.getId());

        return orders.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            OrderResponse response = orderMapper.toOrderResponse(order);
            response.setItems(items.stream()
                    .map(orderItemMapper::toOrderItemResponse)
                    .collect(Collectors.toList()));
            return response;
        }).toList();
    }

    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        order.setStatus(status);
        orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.CANNOT_CANCEL_ORDER);
        }
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public OrderResponse getOrder(Long orderId) {
        String username = getCurrentUsername();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getUsername().equals(username)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setItems(items.stream()
                .map(orderItemMapper::toOrderItemResponse)
                .collect(Collectors.toList()));

        return response;
    }

    public Long getTotalOrders() {
        return orderRepository.countTotalOrders();
    }

    public Double getTotalPaidRevenue() {
        return orderRepository.getTotalPaidRevenue();
    }


    public List<OrderResponse> getAllOrdersByAdmin() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            OrderResponse response = orderMapper.toOrderResponse(order);
            User user = order.getUser();
            response.setUsername(user.getUsername());
            List<OrderItemResponse> orderItemResponses = items.stream()
                    .map(orderItemMapper::toOrderItemResponse)
                    .collect(Collectors.toList());
            response.setItems(orderItemResponses);
            return response;
        }).collect(Collectors.toList());
    }




}
