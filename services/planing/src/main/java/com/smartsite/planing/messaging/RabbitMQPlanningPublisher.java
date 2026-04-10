package com.smartsite.planing.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.smartsite.planing.rabbitmq.RabbitMQConfig;
import com.smartsite.planing.rabbitmq.TaskAssigneEvent;

@Service
public class RabbitMQPlanningPublisher {

	private final RabbitTemplate rabbitTemplate;

	public RabbitMQPlanningPublisher(RabbitTemplate rabbitTemplate) {
		this.rabbitTemplate = rabbitTemplate;
	}

	public void publishTaskAssignment(TaskAssigneEvent event) {
		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE_NAME,
				RabbitMQConfig.ROUTING_KEY + ".task.assigned",
				event);
	}
}
