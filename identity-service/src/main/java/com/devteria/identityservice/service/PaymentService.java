package com.devteria.identityservice.service;

import com.devteria.identityservice.configuration.VNPAYConfig;
import com.devteria.identityservice.dto.request.VNPayRequest;
import com.devteria.identityservice.dto.response.VNPayResponse;
import com.devteria.identityservice.entity.Order;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.enums.OrderStatus;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.repository.OrderRepository;
import com.devteria.identityservice.repository.UserRepository;
import com.devteria.identityservice.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final VNPAYConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    public VNPayResponse createVnPayPayment(Long orderId, HttpServletRequest request) {
        // Lấy người dùng hiện tại
        User currentUser = getCurrentUser();

        // Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // ⚠️ Kiểm tra xem đơn hàng có thuộc về người dùng này không
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // hoặc tạo thêm error code ORDER_NOT_OWNED
        }

        long amount = (long) (order.getTotalAmount() * 100);
        String bankCode = request.getParameter("VNPAYQR");

        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        vnpParamsMap.put("vnp_TxnRef", String.valueOf(orderId));
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toán đơn hàng ID: " + orderId);

        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }

        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl)
                .build();
    }


    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public String handleVnPayIpn(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef");

        try {
            if ("00".equals(status)) {
                Long orderId = Long.parseLong(txnRef);
                Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);

                return "success";
            } else {
                return "failure";
            }
        } catch (Exception e) {
            return "error";
        }
    }



}