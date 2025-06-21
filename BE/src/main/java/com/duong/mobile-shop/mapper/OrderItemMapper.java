package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.response.OrderItemResponse;
import com.devteria.identityservice.entity.OrderItem;
import com.devteria.identityservice.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

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