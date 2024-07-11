package com.fyp.hca.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class HospitalPatientCount {
    private List<List<Object>> patientCounts;
}
