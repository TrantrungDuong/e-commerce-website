package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.OrderRequest;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.enums.OrderStatus;
import com.devteria.identityservice.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {

    OrderService orderService;

    // Buy now
    @PostMapping("/buy-now")
    ApiResponse<OrderResponse> buyNow(@RequestBody OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.buyNow(request))
                .build();
    }

    // Checkout all cart
    @PostMapping("/checkout")
    ApiResponse<OrderResponse> checkoutFromCart() {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.checkoutFromCart())
                .build();
    }

//     get all user's order
    @GetMapping
    ApiResponse<List<OrderResponse>> getOrdersByUser() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getOrdersByUser())
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable Long orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrder(orderId))
                .build();
    }


    // Update order status
    @PutMapping("/{orderId}/status")
    ApiResponse<Void> updateStatus(@PathVariable("orderId") Long orderId,
                                   @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ApiResponse.<Void>builder().build();
    }

    @PutMapping("/{orderId}/cancel")
    ApiResponse<Void> cancelOrder(@PathVariable("orderId") Long orderId) {
        orderService.cancelOrder(orderId);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/total-order")
    public ApiResponse<Long> getTotalOrders() {
        return ApiResponse.<Long>builder()
                .result(orderService.getTotalOrders())
                .build();
    }

    @GetMapping("/total-paid-revenue")
    public ApiResponse<Double> getTotalPaidRevenue() {
        Double totalPaidRevenue = orderService.getTotalPaidRevenue();
        return ApiResponse.<Double>builder()
                .result(totalPaidRevenue)
                .build();
    }
    @GetMapping("/all-orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrdersByAdmin();
        return ResponseEntity.ok(orders);
    }
}
