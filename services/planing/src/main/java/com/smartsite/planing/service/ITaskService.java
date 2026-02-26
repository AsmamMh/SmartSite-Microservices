package com.smartsite.planing.service;

import java.util.List;

import com.smartsite.planing.domain.entity.Task;

public interface ITaskService {
    void DeleteTAsk(Long id);
    Task AddTAsk(Long projectId,Task task);
    Task updateTask(Task Task,Long id);
    Task getTaskById(Long id);

    List<Task> getByProject(Long projectId);


}
