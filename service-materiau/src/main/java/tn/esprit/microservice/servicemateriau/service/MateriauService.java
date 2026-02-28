package tn.esprit.microservice.servicemateriau.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.client.ChantierFeignClient;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.repository.MateriauRepository;

import java.util.List;

@Service
public class MateriauService {

    private final MateriauRepository repository;

    @Autowired
    private ChantierFeignClient chantierFeignClient;

    // Constructor Injection (BEST PRACTICE 🔥)
    public MateriauService(MateriauRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Materiau add(Materiau m) {
        return repository.save(m);
    }

    // READ ALL
    public List<Materiau> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Materiau getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Materiau update(Long id, Materiau m) {

        Materiau existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Materiau not found"));

        existing.setNom(m.getNom());
        existing.setPays(m.getPays());
        existing.setUnite(m.getUnite());
        existing.setQuantite(m.getQuantite());
        existing.setCoutUnitaire(m.getCoutUnitaire());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<ChantierResponse> getChantiersExternes(){
        return chantierFeignClient.getAllChantiers().getBody();
    }
}