package com.smartsite.planing.service;

import java.util.List;


import com.smartsite.planing.domain.entity.TaskAssigne;

public interface ITaskAssigne {
      TaskAssigne create(Long taskId, TaskAssigne taskAssigne);

    TaskAssigne update(Long id, TaskAssigne taskAssigne);

    TaskAssigne getById(Long id);

    List<TaskAssigne> getByTask(Long taskId);

    List<TaskAssigne> getByWorker(Long workerId);

    List<TaskAssigne> getByTeam(Long teamId);

    void delete(Long id);
}
