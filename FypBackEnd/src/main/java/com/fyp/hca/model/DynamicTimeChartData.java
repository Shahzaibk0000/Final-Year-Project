package com.fyp.hca.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DynamicTimeChartData {
    private List<List<Object>> dataPoints;

    public DynamicTimeChartData(List<List<Object>> dataPoints) {
        this.dataPoints = dataPoints;
    }
}
