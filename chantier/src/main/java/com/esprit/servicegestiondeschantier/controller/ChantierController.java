package com.esprit.servicegestiondeschantier.controller;

import com.esprit.servicegestiondeschantier.entity.Chantier;
import com.esprit.servicegestiondeschantier.entity.StatutChantier;
import com.esprit.servicegestiondeschantier.service.ChantierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/chantiers")
public class ChantierController {

    @Autowired
    private ChantierService chantierService;

    // CREATE - Créer un nouveau chantier
    @PostMapping
    public ResponseEntity<Chantier> createChantier(@RequestBody Chantier chantier) {
        Chantier savedChantier = chantierService.createChantier(chantier);
        return new ResponseEntity<>(savedChantier, HttpStatus.CREATED);
    }

    // READ - Récupérer tous les chantier
    @GetMapping
    public ResponseEntity<List<Chantier>> getAllChantiers() {
        List<Chantier> chantiers = chantierService.getAllChantiers();
        return new ResponseEntity<>(chantiers, HttpStatus.OK);
    }

    // READ - Récupérer un chantier par ID
    @GetMapping("/{id}")
    public ResponseEntity<Chantier> getChantierById(@PathVariable Long id) {
        return chantierService.getChantierById(id)
                .map(chantier -> new ResponseEntity<>(chantier, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE - Mettre à jour un chantier
    @PutMapping("/{id}")
    public ResponseEntity<Chantier> updateChantier(@PathVariable Long id, @RequestBody Chantier chantier) {
        try {
            Chantier updatedChantier = chantierService.updateChantier(id, chantier);
            return new ResponseEntity<>(updatedChantier, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE - Supprimer un chantier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChantier(@PathVariable Long id) {
        try {
            chantierService.deleteChantier(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // READ - Rechercher par statut
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Chantier>> getChantiersByStatut(@PathVariable StatutChantier statut) {
        List<Chantier> chantiers = chantierService.getChantiersByStatut(statut);
        return new ResponseEntity<>(chantiers, HttpStatus.OK);
    }

    // READ - Rechercher par nom
    @GetMapping("/search")
    public ResponseEntity<List<Chantier>> searchChantiersByNom(@RequestParam String nom) {
        List<Chantier> chantier = chantierService.searchChantiersByNom(nom);
        return new ResponseEntity<>(chantier, HttpStatus.OK);
    }

    // READ - Rechercher par période
    @GetMapping("/periode")
    public ResponseEntity<List<Chantier>> getChantiersByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        List<Chantier> chantier = chantierService.getChantiersByPeriode(debut, fin);
        return new ResponseEntity<>(chantier, HttpStatus.OK);
    }

    // READ - Compter les chantier
    @GetMapping("/count")
    public ResponseEntity<Long> countChantiers() {
        long count = chantierService.countChantiers();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
