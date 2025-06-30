package com.duong.mobile_shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.duong.mobile_shop.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserIdAndProductId(String userId, Long productId);

    List<Wishlist> findByUserId(String userId);
}
