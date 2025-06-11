package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserIdAndProductId(String userId, Long productId);

    List<Wishlist> findByUserId(String userId);
}
