package com.esprit.smartsite.Services;

import com.esprit.smartsite.Entites.Site;

import java.util.List;

public interface SiteService {
    Site addSite(Site site);
    List<Site> getAllSites();
    Site getSiteById(Long id);
    Site updateSite(Long id, Site site);
    void deleteSite(Long id);
}
