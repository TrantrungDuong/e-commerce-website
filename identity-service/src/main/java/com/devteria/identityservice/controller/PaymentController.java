package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.response.VNPayResponse;
import com.devteria.identityservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ApiResponse<VNPayResponse> pay(HttpServletRequest request) {
        try {
            VNPayResponse vnPayResponse = paymentService.createVnPayPayment(request);
            return ApiResponse.<VNPayResponse>builder()
                    .result(vnPayResponse)
                    .build();
        } catch (Exception e) {
            // Handle exception (optional)
            return ApiResponse.<VNPayResponse>builder()
                    .result(new VNPayResponse("99", "Error", e.getMessage()))
                    .build();
        }
    }

    @GetMapping("/vn-pay-callback")
    public ApiResponse<VNPayResponse> payCallbackHandler(@RequestParam("vnp_ResponseCode") String status) {
        if ("00".equals(status)) {
            return ApiResponse.<VNPayResponse>builder()
                    .result(new VNPayResponse("00", "Success", ""))
                    .build();
        } else {
            return ApiResponse.<VNPayResponse>builder()
                    .result(new VNPayResponse("11", "Failed", null))
                    .build();
        }
    }
}
