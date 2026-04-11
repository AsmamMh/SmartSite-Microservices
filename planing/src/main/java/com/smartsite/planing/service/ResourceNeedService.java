package com.smartsite.planing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartsite.planing.domain.entity.ResourceNeed;
import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.repository.ResourcesREpository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResourceNeedService implements IResourceNeed {

    private final ResourcesREpository resourcesREpository;
    private final ITaskService taskRepository;
    @Override
    public ResourceNeed addRessource(ResourceNeed resourceNeed,Long id) {
        Task task=this.taskRepository.getTaskById(id);
        resourceNeed.setTask(task);
        return this.resourcesREpository.save(resourceNeed);
    }

    @Override
    public void DeleteRessource(Long id) {
        this.resourcesREpository.deleteById(id);
    }

    @Override
    public ResourceNeed updateResourceNeed(ResourceNeed resourceNeed, Long id) {
        ResourceNeed existing = getById(id);
        existing.setCategory(resourceNeed.getCategory());
        existing.setType(resourceNeed.getType());
        existing.setQuantity(resourceNeed.getQuantity());
        existing.setUnit(resourceNeed.getUnit());
        return this.resourcesREpository.save(existing);
    }
    
    @Override
    public ResourceNeed getById(Long id) {
        return this.resourcesREpository.findById(id)
                .orElseThrow(() -> new RuntimeException("ResourceNeed not found"));

    }

    @Override
    public List<ResourceNeed> getByTask(Long taskId) {
        return this.resourcesREpository.findByTaskId(taskId);
    }

}
