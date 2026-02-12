package com.smartsite.planing.service;

import org.apache.kafka.streams.processor.assignment.KafkaStreamsAssignment.AssignedTask;

public interface ITaskAssigne {
    void deleteAssigneTAsk(Long id);
    AssignedTask AddAssigneTAsk(AssignedTask assignedTask);
    AssignedTask uPdateAssignedTask(AssignedTask assignedTask,Long id);
    AssignedTask getAssigneTAskByID(Long id);
}
