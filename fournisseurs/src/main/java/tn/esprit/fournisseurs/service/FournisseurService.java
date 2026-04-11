package tn.esprit.fournisseurs.service;

import tn.esprit.fournisseurs.entity.Fournisseur;

import java.util.List;

public interface FournisseurService {
    List<Fournisseur> findAll();
    Fournisseur findById(Long id);
    Fournisseur save(Fournisseur fournisseur);
    Fournisseur update(Long id, Fournisseur fournisseur);
    void deleteById(Long id);
}