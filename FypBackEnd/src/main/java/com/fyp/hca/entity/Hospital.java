package com.fyp.hca.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Hospital extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 255)
    private String code;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "hospital_type", nullable = false, length = 255)
    private String hospitalType;

    @ManyToOne
    @JoinColumn(name = "tehsil_id", referencedColumnName = "id", nullable = true)
    private Tehsil tehsil;
}