package com.duong.mobile_shop.controller;
import com.duong.mobile_shop.dto.request.ApiResponse;
import com.duong.mobile_shop.dto.response.VNPayResponse;
import com.duong.mobile_shop.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @GetMapping("/vn-pay/{orderId}")
    public ApiResponse<VNPayResponse> pay(@PathVariable Long orderId, HttpServletRequest request) {
        VNPayResponse vnPayResponse = paymentService.createVnPayPayment(orderId, request);
        return ApiResponse.<VNPayResponse>builder()
                .result(vnPayResponse)
                .build();
    }


//    @GetMapping("/vn-pay-callback")
//    public ApiResponse<VNPayResponse> payCallbackHandler(HttpServletRequest request) {
//        String status = request.getParameter("vnp_ResponseCode");
//        if (status.equals("00")) {
//            return ApiResponse.<VNPayResponse>builder()
//                    .result(new VNPayResponse("00", "Success", ""))
//                    .build();
//        } else {
//            return ApiResponse.<VNPayResponse>builder()
//                    .result(new VNPayResponse("11", "Failed", null))
//                    .build();
//        }
//    }

    @GetMapping("/vn-pay-ipn")
    public String vnPayIpnHandler(HttpServletRequest request) {
        return paymentService.handleVnPayIpn(request);
    }



}