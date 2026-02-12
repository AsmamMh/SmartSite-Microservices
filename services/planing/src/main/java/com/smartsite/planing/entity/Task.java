package com.smartsite.planing.entity;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "task")
@Getter
@Setter
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String title;
   
    private Duration esimatedDuration;


    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;

    private Duration estimatedDuration;

    @Enumerated(EnumType.STRING)
    private TaskSTatus  status= TaskSTatus.PLANNED;

    private BigDecimal progress= BigDecimal.ZERO;

    private String description;

    private Set<Task> predecessors = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "task_ressource_needs" , joinColumns = @JoinColumn(name = "task_id"))
    
    
   
    // @OneToMany(M)

    @OneToMany(mappedBy = "task",cascade = CascadeType.ALL)
    private List<ResourceNeed> ressources = new ArrayList<>();

    @OneToMany(mappedBy = "task" , cascade = CascadeType.ALL )
    private List<TaskAssigne> assignments = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project" , nullable = false)
    private Project project;
}
