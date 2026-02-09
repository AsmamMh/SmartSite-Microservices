package com.esprit.smartsite.Controllers;

import com.esprit.smartsite.Entites.Site;
import com.esprit.smartsite.Services.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    @PostMapping
    public Site createSite(@RequestBody Site site) {
        return siteService.addSite(site);
    }

    @GetMapping
    public List<Site> getAllSites() {
        return siteService.getAllSites();
    }

    @GetMapping("/{id}")
    public Site getSite(@PathVariable Long id) {
        return siteService.getSiteById(id);
    }

    @PutMapping("/{id}")
    public Site updateSite(@PathVariable Long id, @RequestBody Site site) {
        return siteService.updateSite(id, site);
    }

    @DeleteMapping("/{id}")
    public void deleteSite(@PathVariable Long id) {
        siteService.deleteSite(id);
    }
}
