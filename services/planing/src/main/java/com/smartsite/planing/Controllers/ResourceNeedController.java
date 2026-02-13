package com.smartsite.planing.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.ResourceNeed;
import com.smartsite.planing.service.IResourceNeed;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/resource")
public class ResourceNeedController {
    
    private  IResourceNeed resourceNeedService;
    public ResourceNeedController(IResourceNeed resourceNeedService) {
        this.resourceNeedService = resourceNeedService;
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<ResourceNeed> postRessource(@RequestBody ResourceNeed resourceNeed,@PathVariable Long taskId){
        return ResponseEntity.ok(this.resourceNeedService.addRessource(resourceNeed,taskId));
    }

    @PostMapping
    public ResponseEntity<ResourceNeed> postRessource(@RequestBody ResourceNeed resourceNeed){
        return ResponseEntity.ok(this.resourceNeedService.addRessource(resourceNeed,1L));
    }

    @GetMapping("/{resourceId}")
    public ResponseEntity<ResourceNeed> getResourceNeedById(@PathVariable Long resourceId) {
        return ResponseEntity.ok(this.resourceNeedService.getById(resourceId));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<ResourceNeed>> getResourceByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(this.resourceNeedService.getByTask(taskId));
    }
}
