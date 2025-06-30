package com.duong.mobile_shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duong.mobile_shop.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);

    boolean existsByUserIdAndOrderItemId(String userId, Long orderItemId);
}
