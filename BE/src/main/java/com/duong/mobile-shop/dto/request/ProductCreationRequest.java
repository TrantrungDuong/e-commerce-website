package com.devteria.identityservice.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {

    String name;
    Double price;
    String storage;
    String ram;
    String battery;
    String color;
    String brandName;
}
