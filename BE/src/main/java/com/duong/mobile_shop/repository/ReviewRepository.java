package com.duong.mobile_shop.repository;

import com.duong.mobile_shop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);

    boolean existsByUserIdAndOrderItemId(String userId, Long orderItemId);

}
