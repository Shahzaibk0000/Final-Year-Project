package com.fyp.hca.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class StatisticResponseModel {
    private long PatientsTotalCount;
    private long PatientsCount;
    private long PatientsDeathsCount;
    private long PatientsRecoveredCount;
    private long PatientsChronicCount;
    private Date admissionStartDate;
    private Date admissionEndDate;
    private long malePatientCount;
    private long femalePatientCount;
}
