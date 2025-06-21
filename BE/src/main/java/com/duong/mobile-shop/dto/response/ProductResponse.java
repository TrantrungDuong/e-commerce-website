package com.devteria.identityservice.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {

    Long id;

    String name;

    Double price;

    List<String> imageUrl;

    String storage;

    String ram;

    String battery;

    String color;

    String brandName;
}
