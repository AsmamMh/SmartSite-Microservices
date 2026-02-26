package com.smartsite.notification.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepositorry extends JpaRepository<Notification,Long> {
    
}
