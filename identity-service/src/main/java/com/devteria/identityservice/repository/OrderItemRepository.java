package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long > {

    List<OrderItem> findByOrderId(Long orderId);


}
