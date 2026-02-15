package com.smartsite.notification.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.notification.notification.Notification;



public interface  NotificationRepository extends JpaRepository<Notification,Long> {
    
}
