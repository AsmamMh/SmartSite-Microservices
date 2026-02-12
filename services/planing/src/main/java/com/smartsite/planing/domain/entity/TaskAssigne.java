package com.smartsite.planing.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.hibernate.annotations.ManyToAny;

import com.smartsite.planing.domain.enums.AssignedStatus;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class TaskAssigne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private Long workerId;
    private Long teamId;
    
    @Column(precision = 4 , scale = 2)
    private BigDecimal assignedHOurs;

    @Enumerated(EnumType.STRING)
    private AssignedStatus assignedStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id",nullable = false)
    private Task task;    
}
