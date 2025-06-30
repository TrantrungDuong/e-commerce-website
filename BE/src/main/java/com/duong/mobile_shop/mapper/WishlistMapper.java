package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.duong.mobile_shop.dto.response.WishlistResponse;
import com.duong.mobile_shop.entity.Product;
import com.duong.mobile_shop.entity.User;
import com.duong.mobile_shop.entity.Wishlist;

@Mapper(componentModel = "spring")
public interface WishlistMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "price")
    @Mapping(source = "product.imageUrl", target = "imageUrl")
    @Mapping(source = "product.brand.name", target = "brandName")
    WishlistResponse toWishlistResponse(Wishlist wishlist);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "addedAt", ignore = true)
    Wishlist toWishlist(User user, Product product);
}
