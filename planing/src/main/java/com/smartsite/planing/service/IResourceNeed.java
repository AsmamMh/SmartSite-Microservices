package com.smartsite.planing.service;

import java.util.List;

import com.smartsite.planing.domain.entity.ResourceNeed;

public interface IResourceNeed {
    ResourceNeed addRessource(ResourceNeed resourceNeed,Long id);
    void DeleteRessource(Long id);
    ResourceNeed updateResourceNeed(ResourceNeed ressourceNeed,Long id);
    ResourceNeed getById(Long id);
    List<ResourceNeed> getByTask(Long taskId);
}
