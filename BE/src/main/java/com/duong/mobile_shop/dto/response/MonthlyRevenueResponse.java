package com.duong.mobile_shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenueResponse {
    private int year;
    private int month;
    private double totalRevenue;
}
