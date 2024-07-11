package com.fyp.hca.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoField;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "first_name", nullable = false, length = 255)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 255)
    private String lastName;

    @Column(name = "cnic", nullable = true, length = 255, unique = true)
    private String cnic;

    @Column(name = "gender", nullable = true, length = 255)
    private String gender;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "blood", nullable = false)
    private Boolean blood;

    @Column(name = "chronicdisease", nullable = false)
    private Boolean chronicdisease;

    @Column(name = "diabetes", nullable = true)
    private Boolean diabetes;

    @Column(name = "high_Fever", nullable = true)
    private Boolean highFever;

    @Column(name = "fever", nullable = true)
    private Boolean fever;

    @Column(name = "hypertension", nullable = true)
    private Boolean hypertension;

    @Column(name = "cardiac", nullable = true)
    private Boolean cardiac;

    @Column(name = "weakness_pain", nullable = true)
    private Boolean weaknessPain;

    @Column(name = "respiratory", nullable = true)
    private Boolean respiratory;

    @Column(name = "cancer", nullable = true)
    private Boolean cancer;

    @Column(name = "thyroid", nullable = true)
    private Boolean thyroid;

    @Column(name = "prostate", nullable = true)
    private Boolean prostate;

    @Column(name = "kidney", nullable = true)
    private Boolean kidney;

    @Column(name = "neuro", nullable = true)
    private Boolean neuro;

    @Column(name = "nausea", nullable = true)
    private Boolean nausea;

    @Column(name = "asymptomatic", nullable = true)
    private Boolean asymptomatic;

    @Column(name = "gastrointestinal", nullable = true)
    private Boolean gastrointestinal;

    @Column(name = "ortho", nullable = true)
    private Boolean ortho;

    @Column(name = "respiratory_CD", nullable = true)
    private Boolean respiratoryCD;

    @Column(name = "cardiacs_cd", nullable = true)
    private Boolean cardiacsCD;

    @Column(name = "kidney_CD", nullable = true)
    private Boolean kidneyCD;

    @Column(name = "admission_date", nullable = true)
    private Date admissionDate;

    @Column(name = "death_binary", nullable = true)
    private Boolean deathBinary;

    @ManyToOne
    @JoinColumn(name = "hospital_id", referencedColumnName = "id", nullable = true)
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name = "disease_id", referencedColumnName = "id")
    private Disease disease;

    public Object getHospitalName() {
        return hospital.getName();
    }
    public int getAdmissionYear() {
        if (admissionDate != null) {
            LocalDate localDate = admissionDate.toLocalDate();
            return localDate.get(ChronoField.YEAR);
        } else {
            return -1; // Handle cases where admissionDate is null
        }
    }

}