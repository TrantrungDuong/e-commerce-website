package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.OrderRequest;
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

    // Lấy tên người dùng hiện tại từ SecurityContextHolder
    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // Mua ngay một sản phẩm (Buy Now)
    public OrderResponse buyNow(OrderRequest request) {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Tạo đơn hàng với trạng thái PENDING
        Order order = orderMapper.toOrder(user, product, request.getQuantity());
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        // Tạo OrderItem cho sản phẩm trong đơn hàng
        OrderItem orderItem = orderItemMapper.toOrderItem(product, request.getQuantity());
        orderItem.setOrder(order);
        orderItemRepository.save(orderItem);

        // Chuyển đơn hàng thành OrderResponse và trả về
        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setItems(List.of(orderItemMapper.toOrderItemResponse(orderItem)));
        return response;
    }

    // Thanh toán và tạo đơn hàng từ giỏ hàng
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

        // Tính toán tổng giá trị đơn hàng
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Tạo đơn hàng mới
        Order order = orderMapper.toOrder(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        // Tạo OrderItem từ giỏ hàng
        List<OrderItem> orderItems = cartItems.stream().map(item -> {
            OrderItem oi = orderItemMapper.toOrderItem(item.getProduct(), item.getQuantity());
            oi.setOrder(order);
            return oi;
        }).toList();

        orderItemRepository.saveAll(orderItems);
        cartItemRepository.deleteAll(cartItems);

        // Chuyển đơn hàng thành OrderResponse và trả về
        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setItems(orderItems.stream()
                .map(orderItemMapper::toOrderItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    // Lấy tất cả đơn hàng của người dùng
    public List<OrderResponse> getOrdersByUser() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Trả về danh sách đơn hàng với chi tiết các sản phẩm
        return orders.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            OrderResponse response = orderMapper.toOrderResponse(order);
            response.setItems(items.stream()
                    .map(orderItemMapper::toOrderItemResponse)
                    .collect(Collectors.toList()));
            return response;
        }).toList();
    }

    // Cập nhật trạng thái đơn hàng
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Cập nhật trạng thái đơn hàng
        order.setStatus(status);
        orderRepository.save(order);
    }

    // Hủy đơn hàng
    public void cancelOrder(Long orderId) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Kiểm tra quyền sở hữu đơn hàng
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Chỉ cho phép hủy đơn hàng khi trạng thái là PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.CANNOT_CANCEL_ORDER);
        }

        // Cập nhật trạng thái đơn hàng thành CANCELLED
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
}
