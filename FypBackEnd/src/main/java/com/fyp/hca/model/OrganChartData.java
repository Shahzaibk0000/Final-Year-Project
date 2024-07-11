package com.fyp.hca.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OrganChartData {
    long heartCount;
    long largeIntestineCount;
    long smallIntestineCount;
    long kidneyCount;
    long lungCount;
}
