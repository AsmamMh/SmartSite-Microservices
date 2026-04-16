package com.smartsite.notification.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepositorry extends JpaRepository<Notification,Long> {
    List<Notification> findByReceiver(String receiver);
}
