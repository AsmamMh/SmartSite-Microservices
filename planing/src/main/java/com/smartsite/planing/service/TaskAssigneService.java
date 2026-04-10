package com.smartsite.planing.service;

import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.smartsite.planing.domain.entity.Project;
import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.domain.entity.TaskAssigne;
import com.smartsite.planing.rabbitmq.RabbitMQConfig;
import com.smartsite.planing.rabbitmq.TaskAssigneEvent;
import com.smartsite.planing.repository.TaskAssigneRepository;
import com.smartsite.planing.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskAssigneService implements ITaskAssigne {

    private final TaskAssigneRepository taskAssigneRepository;
    private final TaskRepository taskRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
        public TaskAssigne create(Long taskId, TaskAssigne taskAssigne) {

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            Project project = task.getProject();
            
            taskAssigne.setTask(task);
              taskAssigne.setProject(project);   
            TaskAssigne savedTaskAssigne = taskAssigneRepository.save(taskAssigne);
            TaskAssigneEvent event = new TaskAssigneEvent(
                    taskAssigne.getProject().getId(), 
                    task.getId(),
                    savedTaskAssigne.getWorkerId(),
                    taskAssigne.getTitle(), taskAssigne.getDescription());

            System.out.println("Sending message: "
             + event.getTaskId() + 
             " assigned to worker " + event.getWorkerId() + 
            " for project " + event.getProjectId() +
            " Task title: " + event.getTitle() +
            " Task description: " + event.getDescription()
        
        );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, event);
            return savedTaskAssigne;
        }

    @Override
    public TaskAssigne update(Long id, TaskAssigne taskAssigne) {
        TaskAssigne existing = getById(id);

        existing.setDate(taskAssigne.getDate());
        existing.setWorkerId(taskAssigne.getWorkerId());
        existing.setTeamId(taskAssigne.getTeamId());
        existing.setAssignedHOurs(taskAssigne.getAssignedHOurs());
        existing.setAssignedStatus(taskAssigne.getAssignedStatus());

        return taskAssigneRepository.save(existing);
    }

    @Override
    public TaskAssigne getById(Long id) {
        return taskAssigneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    @Override
    public List<TaskAssigne> getByTask(Long taskId) {
        return taskAssigneRepository.findByTaskId(taskId);
    }

    @Override
    public List<TaskAssigne> getByWorker(Long workerId) {
        return taskAssigneRepository.findByWorkerId(workerId);
    }

    @Override
    public List<TaskAssigne> getByTeam(Long teamId) {
        return taskAssigneRepository.findByTeamId(teamId);
    }

    @Override
    public void delete(Long id) {
        taskAssigneRepository.deleteById(id);
    }

}
