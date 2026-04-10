package com.smartsite.planing.domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDTO {
    private Long projectId;
    private Long taskId;
    private Long workerId;
    private String title;
    private String description;
    private String notificationType;
}
