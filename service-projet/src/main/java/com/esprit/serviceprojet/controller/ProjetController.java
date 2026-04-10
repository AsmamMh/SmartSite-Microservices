package com.esprit.serviceprojet.controller;

import com.esprit.serviceprojet.entity.Projet;
import com.esprit.serviceprojet.entity.StatutProjet;
import com.esprit.serviceprojet.service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
public class ProjetController {

    @Autowired
    private ProjetService projetService;

    @PostMapping
    public ResponseEntity<Projet> createProjet(@RequestBody Projet projet) {
        Projet savedProjet = projetService.createProjet(projet);
        return new ResponseEntity<>(savedProjet, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Projet>> getAllProjets() {
        List<Projet> projets = projetService.getAllProjets();
        return new ResponseEntity<>(projets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> getProjetById(@PathVariable Long id) {
        return projetService.getProjetById(id)
                .map(projet -> new ResponseEntity<>(projet, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Projet>> getProjetsByStatut(@PathVariable StatutProjet statut) {
        List<Projet> projets = projetService.getProjetsByStatut(statut);
        return new ResponseEntity<>(projets, HttpStatus.OK);
    }

    @GetMapping("/client/{client}")
    public ResponseEntity<List<Projet>> getProjetsByClient(@PathVariable String client) {
        List<Projet> projets = projetService.getProjetsByClient(client);
        return new ResponseEntity<>(projets, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Projet> updateProjet(@PathVariable Long id, @RequestBody Projet projet) {
        try {
            Projet updatedProjet = projetService.updateProjet(id, projet);
            return new ResponseEntity<>(updatedProjet, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        projetService.deleteProjet(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countProjets() {
        long count = projetService.countProjets();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
