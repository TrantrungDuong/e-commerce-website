package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.duong.mobile_shop.dto.response.OrderItemResponse;
import com.duong.mobile_shop.entity.OrderItem;
import com.duong.mobile_shop.entity.Product;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.imageUrl", target = "imageUrl")
    OrderItemResponse toOrderItemResponse(OrderItem item);

    default OrderItem toOrderItem(Product product, int quantity) {
        return OrderItem.builder()
                .product(product)
                .quantity(quantity)
                .priceAtPurchase(product.getPrice())
                .build();
    }

    default void updateOrderItem(@MappingTarget OrderItem target, Product product, int quantity) {
        target.setProduct(product);
        target.setQuantity(quantity);
        target.setPriceAtPurchase(product.getPrice());
    }
}
