package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.ReviewRequest;
import com.devteria.identityservice.dto.response.ReviewResponse;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.Review;
import com.devteria.identityservice.entity.User;
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
