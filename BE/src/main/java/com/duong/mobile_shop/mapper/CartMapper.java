package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.duong.mobile_shop.dto.response.CartItemResponse;
import com.duong.mobile_shop.entity.CartItem;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "price")
    @Mapping(source = "product.imageUrl", target = "imageUrl")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
