package com.smartsite.planing.entity;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.cglib.core.Local;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="tasks")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // @ManyToOne(fetch = FetchType.LAZY)

    // private Task task;
    @Column(nullable = false)
    private String name;



    private String description;
    private LocalDate plannedStart;
    private LocalDate plannedEnd;
    private LocalDate actualStart;
    private LocalDate acctualEnd;

    
    private BigDecimal estimateBudget;
    private BigDecimal actualBudget;

    private Long chantierId;
    private Long clientId;
    private Long responsableId;

    @OneToMany()
    private List<Task> tasks = new ArrayList<>();

    
    
}
