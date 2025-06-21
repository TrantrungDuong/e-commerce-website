package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.response.WishlistResponse;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.entity.Wishlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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


