package com.duong.mobile_shop.mapper;

import java.time.LocalDateTime;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.duong.mobile_shop.dto.response.OrderResponse;
import com.duong.mobile_shop.entity.Order;
import com.duong.mobile_shop.entity.Product;
import com.duong.mobile_shop.entity.User;
import com.duong.mobile_shop.enums.OrderStatus;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(target = "items", ignore = true)
    OrderResponse toOrderResponse(Order order);

    default Order toOrder(User user, Product product, int quantity) {
        return Order.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .totalAmount(product.getPrice() * quantity)
                .build();
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    Order toOrder(User user);
}
