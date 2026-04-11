package tn.esprit.fournisseurs.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.fournisseurs.entity.Fournisseur;
import tn.esprit.fournisseurs.service.FournisseurService;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@RequiredArgsConstructor   // ← Lombok génère le constructeur automatiquement
public class FournisseurController {

    private final FournisseurService service;  // ← OBLIGATOIREMENT final

    @GetMapping
    public ResponseEntity<List<Fournisseur>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Fournisseur> create(@RequestBody Fournisseur fournisseur) {
        return new ResponseEntity<>(service.save(fournisseur), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> update(@PathVariable Long id, @RequestBody Fournisseur fournisseur) {
        return ResponseEntity.ok(service.update(id, fournisseur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}