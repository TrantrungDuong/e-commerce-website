package com.duong.mobile_shop.repository;

import java.util.Optional;

import com.duong.mobile_shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM User u")
    Long countTotalUsers();

}
