package com.smartsite.notification.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskAssigneEvent {
    private Long projectId;
    private Long taskId;
    private Long workerId;
    private String title;
    private String description;

}
