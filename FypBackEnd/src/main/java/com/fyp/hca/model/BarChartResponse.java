package com.fyp.hca.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class BarChartResponse
{
    private List<String> xAxis;
    private List<Integer> yAxis;
}
