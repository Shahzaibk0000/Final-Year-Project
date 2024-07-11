package com.fyp.hca.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.ZonedDateTime;

@MappedSuperclass
@JsonIgnoreProperties(value = {"createdOn", "updatedOn"}, allowGetters = true)
public abstract class BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "CREATED_ON", nullable = true, updatable = false)
    @CreatedDate
    private ZonedDateTime createdOn;

    @Column(name = "UPDATED_ON", nullable = true, updatable = false)
    @LastModifiedDate
    private ZonedDateTime updatedOn;

    public BaseEntity() {
        this.createdOn = ZonedDateTime.now();
    }

    @PreUpdate
    public void setUpdatedOn() {
        this.updatedOn = ZonedDateTime.now();
    }

    @JsonProperty("createdOn")
    public ZonedDateTime getCreatedOn() {
        return createdOn;
    }

    @JsonProperty("updatedOn")
    public ZonedDateTime getUpdatedOn() {
        return updatedOn;
    }
}
