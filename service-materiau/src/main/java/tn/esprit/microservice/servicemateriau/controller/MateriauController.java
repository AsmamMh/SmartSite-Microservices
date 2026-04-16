package tn.esprit.microservice.servicemateriau.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.DTO.PredictionRequest;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.entity.MouvementStock;
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

    // CRUD
    @PostMapping
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
    public ResponseEntity<Materiau> update(@PathVariable Long id, @RequestBody Materiau m) {
        try {
            return ResponseEntity.ok(service.update(id, m));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Gestion Stock
    @PostMapping("/{id}/entree")
    public ResponseEntity<MouvementStock> entree(@PathVariable Long id, @RequestParam Double quantite, @RequestParam(required = false) String commentaire) {
        return ResponseEntity.ok(service.entreeStock(id, quantite, commentaire));
    }

    @PostMapping("/{id}/sortie")
    public ResponseEntity<?> sortie(@PathVariable Long id, @RequestParam Double quantite, @RequestParam(required = false) String commentaire) {
        try {
            return ResponseEntity.ok(service.sortieStock(id, quantite, commentaire));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Métiers avancés
    @GetMapping("/stock-faible")
    public ResponseEntity<List<Materiau>> getStockFaible() {
        return ResponseEntity.ok(service.getStockFaible());
    }

    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        return ResponseEntity.ok(service.getStatistiques());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Materiau>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(service.search(keyword));
    }

    @GetMapping("/filter/localisation/{localisation}")
    public ResponseEntity<List<Materiau>> filterByLocalisation(@PathVariable String localisation) {
        return ResponseEntity.ok(service.filterByLocalisation(localisation));
    }

    @GetMapping("/{id}/historique")
    public ResponseEntity<List<MouvementStock>> getHistorique(@PathVariable Long id) {
        return ResponseEntity.ok(service.getHistorique(id));
    }

    // Communication Chantier
    @GetMapping("/chantiers")
    public ResponseEntity<List<ChantierResponse>> getChantiers() {
        return ResponseEntity.ok(service.getChantiersExternes());
    }

    @GetMapping("/test-chantier")
    public ResponseEntity<Map<String, Object>> testChantier() {
        return ResponseEntity.ok(service.testCommunicationChantier());
    }

    // IA Prédiction
    @PostMapping("/prediction")
    public ResponseEntity<Map<String, Object>> prediction(@RequestBody PredictionRequest request) {
        return ResponseEntity.ok(service.predireConsommation(request));
    }
}