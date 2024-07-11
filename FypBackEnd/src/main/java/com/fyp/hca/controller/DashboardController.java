package com.fyp.hca.controller;

import com.fyp.hca.model.BarChartResponse;
import com.fyp.hca.model.FiltersRequestModel;
import com.fyp.hca.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PostMapping("/getDashboardData/{userId}/{diseaseId}")
    public ResponseEntity<?> getDashboardData(@PathVariable Integer userId,
                                              @PathVariable Integer diseaseId,
                                              @RequestBody(required = false) FiltersRequestModel filters) {
        try {
            return ResponseEntity.ok(dashboardService.getDashboardData(userId, diseaseId, filters));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/getBarChartData/{areaType}/{userId}/{diseaseId}")
    public ResponseEntity<?> getBarChartData(@PathVariable String areaType,
                                             @PathVariable Integer userId,
                                             @PathVariable Integer diseaseId,
                                             @RequestBody(required = false) FiltersRequestModel filters) {
        try {
            BarChartResponse response = dashboardService.getBarChartData(areaType, userId, diseaseId, filters);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
