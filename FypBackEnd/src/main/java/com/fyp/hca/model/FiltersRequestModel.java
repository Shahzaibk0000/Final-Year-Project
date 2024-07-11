package com.fyp.hca.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Date;

@Data
public class FiltersRequestModel {
    public List<Integer> provinceIds;
    public List<Integer> divisionIds;
    public List<Integer> districtIds;
    public List<Integer> tehsilIds;
    public List<Integer> hospitalIds;
    public List<String> symptoms;
    public Date admissionStartDate;
    public Date admissionEndDate;
    public Integer gender;
    public Integer ageStart;
    public Integer ageEnd;
}