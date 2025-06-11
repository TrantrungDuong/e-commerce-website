package com.devteria.identityservice.service;
import com.devteria.identityservice.dto.response.WishlistResponse;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.entity.Wishlist;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.WishlistMapper;
import com.devteria.identityservice.repository.ProductRepository;
import com.devteria.identityservice.repository.UserRepository;
import com.devteria.identityservice.repository.WishlistRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WishlistService {

    WishlistRepository wishlistRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    WishlistMapper wishlistMapper;

    // add product to wishlist
    public void addToWishlist(Long productId) {
        User user = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) return;
        Wishlist wishlist = wishlistMapper.toWishlist(user, product);
        wishlist.setAddedAt(LocalDateTime.now());

        wishlistRepository.save(wishlist);
    }

    // delete product from wishlist
    public void removeFromWishlist(Long productId) {
        User user = getCurrentUser();

        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new AppException(ErrorCode.WISHLIST_ITEM_NOT_FOUND));

        wishlistRepository.delete(wishlist);
    }

    // get user's current wishlist
    public List<WishlistResponse> getMyWishlist() {
        User user = getCurrentUser();

        return wishlistRepository.findByUserId(user.getId())
                .stream()
                .map(wishlistMapper::toWishlistResponse)
                .toList();
    }

    // get token to verify
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
}
