package com.smartsite.planing.domain.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
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
    private List<Long> taskIds;
    private List<Long> assignmentIds;
}
