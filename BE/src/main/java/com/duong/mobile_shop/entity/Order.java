package com.duong.mobile_shop.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;

import com.duong.mobile_shop.enums.OrderStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    User user;

    LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    OrderStatus status;

    Double totalAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<OrderItem> orderItems;
}
