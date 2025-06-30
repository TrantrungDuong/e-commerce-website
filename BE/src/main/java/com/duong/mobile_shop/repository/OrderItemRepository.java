package com.duong.mobile_shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.duong.mobile_shop.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query(
            value =
                    """
	SELECT p.id, p.name, SUM(oi.quantity), MIN(pi.image_url)
	FROM order_item oi
	JOIN product p ON oi.product_id = p.id
	LEFT JOIN product_image_url pi ON pi.product_id = p.id
	JOIN orders o ON oi.order_id = o.id
	WHERE o.status = 'PAID'
	GROUP BY p.id, p.name
	ORDER BY SUM(oi.quantity) DESC
""",
            nativeQuery = true)
    List<Object[]> findTopSellingProducts();
}
