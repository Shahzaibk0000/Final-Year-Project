package com.fyp.hca.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyticResultModel {
    private StatisticResponseModel statisticResponse;
    private DynamicTimeChartData dynamicTimeChartData;
    private OrganChartData organChartData;
    private BarRaceSymptoms barRaceSymptoms;
    private ScatterAggregateBar scatterAggregateBar;
    private boolean dataPresent;
    private HospitalPatientCount hospitalPatientCount;
}
