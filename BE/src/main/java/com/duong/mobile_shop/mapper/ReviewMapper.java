package com.duong.mobile_shop.mapper;


import com.duong.mobile_shop.dto.request.ReviewRequest;
import com.duong.mobile_shop.dto.response.ReviewResponse;
import com.duong.mobile_shop.entity.Product;
import com.duong.mobile_shop.entity.Review;
import com.duong.mobile_shop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "user.username", target = "username")
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toReview(User user, Product product, ReviewRequest request);
}
