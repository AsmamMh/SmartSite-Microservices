package com.smartsite.planing.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

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
@Table(name="projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @ManyToOne(fetch = FetchType.LAZY)

    // private Task task;
    @Column(nullable = false)
    private String name;

    private String description;
    private LocalDate plannedStart;
    private LocalDate plannedEnd;
    private LocalDate actualStart;
    private LocalDate acctualEnd;
    
    @OneToMany(mappedBy = "project",cascade =  CascadeType.ALL)
    private List<TaskAssigne> assignments = new ArrayList<>();
    
    private BigDecimal estimateBudget;
    private BigDecimal actualBudget;

    private Long chantierId;
    private Long clientId;
    private Long responsableId;

    @OneToMany(mappedBy = "project")
    private List<Task> tasks = new ArrayList<>();
}
