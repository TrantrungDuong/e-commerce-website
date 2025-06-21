package com.duong.mobile_shop.repository;

import com.duong.mobile_shop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByPriceAsc();

    List<Product> findAllByOrderByPriceDesc();

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findAllByBrand_NameIgnoreCase(String brandName);

}
