package com.smartsite.notification.dto;

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
    private String workerId;
    private String title;
    private String description;
    private String notificationType;
}
