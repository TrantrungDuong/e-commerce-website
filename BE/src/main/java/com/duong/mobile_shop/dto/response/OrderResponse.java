package com.duong.mobile_shop.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.duong.mobile_shop.enums.OrderStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long id;
    LocalDateTime createdAt;
    OrderStatus status;
    Double totalAmount;
    List<OrderItemResponse> items;
    String username;
}
