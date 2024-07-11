package com.fyp.hca.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Users extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = true)
    private int id;

    @Column(name = "first_name", nullable = false, length = 255)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 255)
    private String lastName;

    @Column(name = "usertype", nullable = false, length = 255)
    private String usertype;

    @Column(name = "contact", nullable = false, length = 255)
    private String contact;

    @Column(name = "cnic", nullable = false, length = 255, unique = true)
    private String cnic;

    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Lob
    @Column(name="profile_picture")
    private byte[] profilePicture;

    @OneToOne(optional = true)
    @JoinColumn(name = "province_id", referencedColumnName = "id", nullable = true, unique = false)
    private Province province;

    @OneToOne(optional = true)
    @JoinColumn(name = "division_id", referencedColumnName = "id", nullable = true, unique = false)
    private Division division;

    @OneToOne(optional = true)
    @JoinColumn(name = "district_id", referencedColumnName = "id", nullable = true, unique = false)
    private District district;

    @OneToOne(optional = true)
    @JoinColumn(name = "tehsil_id", referencedColumnName = "id",nullable = true, unique = false)
    private Tehsil tehsil;

    @OneToOne
    @JoinColumn(name = "hospital_id", referencedColumnName = "id",nullable = true, unique = false)
    private Hospital hospital;

}