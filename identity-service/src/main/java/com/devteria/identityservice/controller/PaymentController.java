package com.devteria.identityservice.controller;
import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.response.VNPayResponse;
import com.devteria.identityservice.service.PaymentService;
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


    @GetMapping("/vn-pay-callback")
    public ApiResponse<VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");

        //get params form vnpay
        //response.sendRedirectToFE(Link)
        // =< in FE call api confirm order API => save order info to database
        if (status.equals("00")) {
            return ApiResponse.<VNPayResponse>builder()
                    .result(new VNPayResponse("00", "Success", ""))
                    .build();
        } else {
            return ApiResponse.<VNPayResponse>builder()
                    .result(new VNPayResponse("11", "Failed", null))
                    .build();
        }
    }

    @GetMapping("/vn-pay-ipn")
    public String vnPayIpnHandler(HttpServletRequest request) {
        return paymentService.handleVnPayIpn(request);
    }



}