package com.duong.mobile_shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duong.mobile_shop.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByPriceAsc();

    List<Product> findAllByOrderByPriceDesc();

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findAllByBrand_NameIgnoreCase(String brandName);
}
