package tn.esprit.fournisseurs.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.fournisseurs.entity.Fournisseur;
import tn.esprit.fournisseurs.repository.FournisseurRepository;
import tn.esprit.fournisseurs.service.FournisseurService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository repository;

    @Override
    public List<Fournisseur> findAll() {
        return repository.findAll();
    }

    @Override
    public Fournisseur findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id : " + id));
    }

    @Override
    public Fournisseur save(Fournisseur fournisseur) {
        if (repository.existsByEmail(fournisseur.getEmail())) {
            throw new RuntimeException("Un fournisseur avec cet email existe déjà");
        }
        return repository.save(fournisseur);
    }

    @Override
    public Fournisseur update(Long id, Fournisseur fournisseur) {
        Fournisseur existing = findById(id);

        existing.setNom(fournisseur.getNom());
        existing.setAdresse(fournisseur.getAdresse());
        existing.setTelephone(fournisseur.getTelephone());

        // On met à jour l'email seulement s'il est différent et non déjà utilisé
        if (!existing.getEmail().equals(fournisseur.getEmail())) {
            if (repository.existsByEmail(fournisseur.getEmail())) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre fournisseur");
            }
            existing.setEmail(fournisseur.getEmail());
        }

        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Fournisseur non trouvé avec l'id : " + id);
        }
        repository.deleteById(id);
    }
}