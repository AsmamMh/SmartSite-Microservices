package com.esprit.smartsite.Services;

import com.esprit.smartsite.Entites.Site;
import com.esprit.smartsite.Repositories.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteServiceImpl implements SiteService {

    private final SiteRepository siteRepository;

    @Override
    public Site addSite(Site site) {
        return siteRepository.save(site);
    }

    @Override
    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    @Override
    public Site getSiteById(Long id) {
        return siteRepository.findById(id).orElse(null);
    }

    @Override
    public Site updateSite(Long id, Site site) {
        site.setId(id);
        return siteRepository.save(site);
    }

    @Override
    public void deleteSite(Long id) {
        siteRepository.deleteById(id);
    }
}
