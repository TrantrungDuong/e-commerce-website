package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.CartItemRequest;
import com.devteria.identityservice.dto.response.CartItemResponse;
import com.devteria.identityservice.dto.response.CartResponse;
import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.CartItem;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.CartMapper;
import com.devteria.identityservice.repository.CartItemRepository;
import com.devteria.identityservice.repository.CartRepository;
import com.devteria.identityservice.repository.ProductRepository;
import com.devteria.identityservice.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartService {

    UserRepository userRepository;
    ProductRepository productRepository;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    CartMapper cartMapper;

    // get products in cart
    public CartResponse getCartItems() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        List<CartItemResponse> items = cartItemRepository.findByCartId(cart.getId())
                .stream()
                .map(cartMapper::toCartItemResponse)
                .toList();

        double totalAmount = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        return CartResponse.builder()
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }




    // add product to cart
    public void addToCart(CartItemRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }
    }


    // update product quantity in cart
    public void updateQuantity(CartItemRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
    }


    // delete product from cart
    public void removeFromCart(Long productId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        cartItemRepository.delete(item);
    }


    // backup method to get or create cart(if cart is existed or not
    private Cart getOrCreateCart(User user) {
        if (user.getCart() == null) {
            Cart newCart = Cart.builder().user(user).build();
            cartRepository.save(newCart);
            user.setCart(newCart);
        }
        return user.getCart();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }


}
