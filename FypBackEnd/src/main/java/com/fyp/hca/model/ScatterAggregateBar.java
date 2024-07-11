package com.fyp.hca.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ScatterAggregateBar {
    private List<int[]> femaleData;
    private List<int[]> maleData;
}
