package com.devteria.identityservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class IdentityServiceApplication {
    public static void main(String[] args) {
        // Load .env variables and set as System properties
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // tránh lỗi nếu thiếu file .env
                .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(IdentityServiceApplication.class, args);
    }
}
