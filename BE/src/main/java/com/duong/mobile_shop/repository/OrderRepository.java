package com.duong.mobile_shop.repository;

import com.duong.mobile_shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long > {
    List<Order> findByUserId(String userId);

    @Query(value = """
        SELECT 
            YEAR(o.created_at) AS year, 
            MONTH(o.created_at) AS month,
            SUM(o.total_amount) AS total_revenue
        FROM orders o
        WHERE o.status = 'PAID'
        GROUP BY YEAR(o.created_at), MONTH(o.created_at)
        ORDER BY year DESC, month DESC
    """, nativeQuery = true)
    List<Object[]> findMonthlyRevenue();

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'PAID'")
    Double getTotalPaidRevenue();



}
