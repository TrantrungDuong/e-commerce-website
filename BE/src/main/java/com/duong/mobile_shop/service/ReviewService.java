package com.duong.mobile_shop.service;



import com.duong.mobile_shop.dto.request.ReviewRequest;
import com.duong.mobile_shop.dto.response.ReviewResponse;
import com.duong.mobile_shop.entity.*;
import com.duong.mobile_shop.enums.OrderStatus;
import com.duong.mobile_shop.exception.AppException;
import com.duong.mobile_shop.exception.ErrorCode;
import com.duong.mobile_shop.mapper.ReviewMapper;
import com.duong.mobile_shop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewService {

    ReviewRepository reviewRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ReviewMapper reviewMapper;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;

    // send review
    public void submitReview(ReviewRequest request) {
        User user = getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<Order> orders = orderRepository.findByUserId(user.getId());
        List<OrderItem> deliveredItems = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PAID)
                .flatMap(o -> orderItemRepository.findByOrderId(o.getId()).stream())
                .filter(oi -> oi.getProduct().getId().equals(product.getId()))
                .toList();

        if (deliveredItems.isEmpty()) {
            throw new AppException(ErrorCode.REVIEW_NOT_ALLOWED);
        }

        for (OrderItem item : deliveredItems) {
            boolean reviewed = reviewRepository.existsByUserIdAndOrderItemId(user.getId(), item.getId());
            if (!reviewed) {
                Review review = reviewMapper.toReview(user, product, request);
                review.setCreatedAt(LocalDateTime.now());
                review.setOrderItem(item);
                reviewRepository.save(review);
                return;
            }
        }

        throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
    }


    // get reviews list by product
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        User user =  getCurrentUser();

        log.info("🔐 Authenticated username: {}", user.getUsername());
        productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return reviewRepository.findByProductId(productId).stream()
                .map(reviewMapper::toReviewResponse)
                .toList();
    }


    // update review
    public void updateReview(Long reviewId, ReviewRequest request) {
        User user = getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);
    }

    // delete review
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewRepository.delete(review);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }


}
