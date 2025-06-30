package com.duong.mobile_shop.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistResponse {
    Long productId;
    String productName;
    String productDescription;
    double price;
    List<String> imageUrl;
    String brandName;
}
