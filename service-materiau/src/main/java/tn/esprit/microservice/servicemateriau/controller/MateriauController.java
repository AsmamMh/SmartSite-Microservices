package tn.esprit.microservice.servicemateriau.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.entity.MateriauConsommation;
import tn.esprit.microservice.servicemateriau.service.MateriauService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/materiaux")
public class MateriauController {

    private final MateriauService service;

    public MateriauController(MateriauService service) {
        this.service = service;
    }

    // ========== CRUD ==========
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CHEF_CHANTIER')")
    public ResponseEntity<Materiau> add(@RequestBody Materiau m) {
        return new ResponseEntity<>(service.add(m), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Materiau>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materiau> getById(@PathVariable Long id) {
        Materiau m = service.getById(id);
        return m != null ? ResponseEntity.ok(m) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CHEF_CHANTIER')")
    public ResponseEntity<Materiau> update(@PathVariable Long id, @RequestBody Materiau m) {
        try {
            return ResponseEntity.ok(service.update(id, m));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== Consommation ==========
    @PostMapping("/{id}/consommer")
    @PreAuthorize("hasRole('CHEF_CHANTIER') or hasRole('OUVRIER')")
    public ResponseEntity<MateriauConsommation> consommer(
            @PathVariable Long id,
            @RequestParam Double quantite,
            @RequestParam Long chantierId) {
        return ResponseEntity.ok(service.ajouterConsommation(id, quantite, chantierId));
    }

    @GetMapping("/{id}/historique")
    public ResponseEntity<List<MateriauConsommation>> getHistorique(@PathVariable Long id) {
        return ResponseEntity.ok(service.getHistoriqueConsommation(id));
    }

    // ========== Alertes ==========
    @GetMapping("/alertes")
    public ResponseEntity<List<Materiau>> getAlertesStock() {
        return ResponseEntity.ok(service.getMateriauxEnDessousSeuil());
    }

    // ========== IA Prédiction ==========
    @GetMapping("/{id}/prediction")
    public ResponseEntity<Map<String, Object>> predictStock(@PathVariable Long id) {
        return ResponseEntity.ok(service.predireRuptureStock(id));
    }

    // ========== Statistiques ==========
    @GetMapping("/statistiques")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStatistiquesGlobales());
    }

    // ========== External ==========
    @GetMapping("/chantiers-externes")
    public ResponseEntity<List<ChantierResponse>> getChantiers() {
        return ResponseEntity.ok(service.getChantiersExternes());
    }
}