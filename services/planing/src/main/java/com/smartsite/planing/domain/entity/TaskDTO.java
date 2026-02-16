package com.smartsite.planing.domain.entity;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartsite.planing.domain.enums.TaskSTatus;

import jakarta.persistence.CascadeType;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@NoArgsConstructor
public class TaskDTO {
    @Id
    private Long id;

    private String title;

    private Duration esimatedDuration;

    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;

    private Duration estimatedDuration;

    
    private TaskSTatus status = TaskSTatus.PLANNED;
    private BigDecimal progress = BigDecimal.ZERO;
    private String description;

   
    private Set<Task> predecessors = new HashSet<>();
    
    private List<ResourceNeed> ressources = new ArrayList<>();

    
    private List<TaskAssigne> assignments = new ArrayList<>();


    private Project project;
}
