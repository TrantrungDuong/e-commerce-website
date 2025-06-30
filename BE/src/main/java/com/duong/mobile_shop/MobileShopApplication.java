package com.duong.mobile_shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableFeignClients
public class MobileShopApplication {
    public static void main(String[] args) {
        // Load .env variables and set as System properties
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // tránh lỗi nếu thiếu file .env
                .load();

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(MobileShopApplication.class, args);
    }
}
