package com.smartsite.notification.rabbitmq;

import java.util.Date;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.smartsite.notification.notification.Notification;
import com.smartsite.notification.notification.NotificationRepositorry;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RabbitMQConsumer {

    private final NotificationRepositorry notificationRepositorry;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleTTaskAssignment(TaskAssigneEvent event) {

        Notification notification = new Notification();
        notification.setTitle(event.getTitle());
        notification.setDescription(event.getDescription());
        notification.setReceiver(event.getWorkerId());
        notification.setReceivedDate(new Date());
        notification.setRead(false);
        notification.setNotificationType("TASK_ASSIGNED");


        notificationRepositorry.save(notification);
        System.out.println("Received message: " + event.getTaskId() + " assigned to worker " + event.getWorkerId() + " for project " + event.getProjectId());
        
    }
}