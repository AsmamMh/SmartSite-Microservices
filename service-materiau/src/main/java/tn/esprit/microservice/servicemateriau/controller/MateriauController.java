package tn.esprit.microservice.servicemateriau.controller;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.service.MateriauService;

import java.util.List;

@RestController
@RequestMapping("/materiaux")
public class MateriauController {

    private final MateriauService service;

    public MateriauController(MateriauService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Materiau> add(@RequestBody Materiau m) {
        Materiau created = service.add(m);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Materiau>> getAll() {
        List<Materiau> list = service.getAll();
        return ResponseEntity.ok(list);
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Materiau> getById(@PathVariable Long id) {
        Materiau m = service.getById(id);
        if (m == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(m);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Materiau> update(@PathVariable Long id, @RequestBody Materiau m) {
        try {
            Materiau updated = service.update(id, m);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/chantiers-external")
    public List<ChantierResponse> getChantiers(){
        return service.getChantiersExternes();
    }
}