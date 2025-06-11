package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.response.CartItemResponse;
import com.devteria.identityservice.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "price")
    @Mapping(expression = "java(cartItem.getProduct().getPrice() * cartItem.getQuantity())", target = "totalPrice")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
