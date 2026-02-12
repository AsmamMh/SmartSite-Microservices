package com.smartsite.planing.service;

import com.smartsite.planing.domain.entity.Task;

public interface ITaskService {
    void DeleteTAsk(Long id);
    Task AddTAsk(Task task);
    Task updateTask(Task Task,Long id);
    Task getTaskById(Long id);
}
