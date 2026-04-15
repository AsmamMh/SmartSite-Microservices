package tn.esprit.microservice.servicemateriau.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.client.ChantierFeignClient;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.entity.MateriauConsommation;
import tn.esprit.microservice.servicemateriau.repository.MateriauConsommationRepository;
import tn.esprit.microservice.servicemateriau.repository.MateriauRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MateriauService {

    private final MateriauRepository repository;
    private final MateriauConsommationRepository consommationRepository;

    @Autowired
    private ChantierFeignClient chantierFeignClient;

    public MateriauService(MateriauRepository repository, MateriauConsommationRepository consommationRepository) {
        this.repository = repository;
        this.consommationRepository = consommationRepository;
    }

    // ========== CRUD ==========
    public Materiau add(Materiau m) {
        return repository.save(m);
    }

    public List<Materiau> getAll() {
        return repository.findAll();
    }

    public Materiau getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Materiau update(Long id, Materiau m) {
        Materiau existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Materiau not found"));
        existing.setNom(m.getNom());
        existing.setPays(m.getPays());
        existing.setUnite(m.getUnite());
        existing.setQuantite(m.getQuantite());
        existing.setCoutUnitaire(m.getCoutUnitaire());
        existing.setSeuilAlerte(m.getSeuilAlerte());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    // ========== Consommation ==========
    public MateriauConsommation ajouterConsommation(Long materiauId, Double quantite, Long chantierId) {
        Materiau materiau = getById(materiauId);
        if (materiau == null) throw new RuntimeException("Matériau non trouvé");

        // Vérifier le stock suffisant
        if (materiau.getQuantite() < quantite) {
            throw new RuntimeException("Stock insuffisant. Stock actuel: " + materiau.getQuantite());
        }

        // Mettre à jour le stock
        materiau.setQuantite(materiau.getQuantite() - quantite);
        repository.save(materiau);

        MateriauConsommation consommation = new MateriauConsommation();
        consommation.setQuantiteConsommee(quantite);
        consommation.setDateConsommation(LocalDateTime.now());
        consommation.setChantierId(chantierId);
        consommation.setMateriau(materiau);

        return consommationRepository.save(consommation);
    }

    public List<MateriauConsommation> getHistoriqueConsommation(Long materiauId) {
        return consommationRepository.findByMateriauIdOrderByDateConsommationAsc(materiauId);
    }

    // ========== Alertes Stock ==========
    public List<Materiau> getMateriauxEnDessousSeuil() {
        return repository.findAll().stream()
                .filter(m -> m.getSeuilAlerte() != null && m.getQuantite() <= m.getSeuilAlerte())
                .collect(Collectors.toList());
    }

    // ========== IA - Prédiction rupture de stock ==========
    public Map<String, Object> predireRuptureStock(Long materiauId) {
        Materiau m = getById(materiauId);
        if (m == null) {
            return Map.of("error", "Matériau non trouvé");
        }

        List<MateriauConsommation> historique = consommationRepository.findByMateriauIdOrderByDateConsommationAsc(materiauId);

        if (historique.size() < 3) {
            return Map.of(
                    "prediction", "Pas assez de données historiques (minimum 3 consommations)",
                    "stockActuel", m.getQuantite(),
                    "seuilAlerte", m.getSeuilAlerte(),
                    "historiqueTaille", historique.size()
            );
        }

        // Régression linéaire simple pour prédire la consommation par heure
        int n = historique.size();
        double sommeX = 0, sommeY = 0, sommeXY = 0, sommeX2 = 0;

        for (int i = 0; i < n; i++) {
            double x = i;
            double y = historique.get(i).getQuantiteConsommee();
            sommeX += x;
            sommeY += y;
            sommeXY += x * y;
            sommeX2 += x * x;
        }

        double pente = (n * sommeXY - sommeX * sommeY) / (n * sommeX2 - sommeX * sommeX);
        double prochaineConsoParHeure = pente;

        if (prochaineConsoParHeure <= 0) {
            prochaineConsoParHeure = historique.get(historique.size() - 1).getQuantiteConsommee() / 24.0;
        }

        double heuresRestantes = m.getQuantite() / prochaineConsoParHeure;
        boolean risqueRupture = heuresRestantes < 48;

        return Map.of(
                "materiauId", materiauId,
                "nomMateriau", m.getNom(),
                "stockActuel", m.getQuantite(),
                "seuilAlerte", m.getSeuilAlerte(),
                "consommationMoyenneParHeure", Math.round(prochaineConsoParHeure * 100.0) / 100.0,
                "heuresRestantesEstimees", Math.round(heuresRestantes * 10.0) / 10.0,
                "risqueRupture", risqueRupture,
                "recommendation", risqueRupture ? "Commander d'urgence !" : "Stock suffisant pour le moment",
                "historiquePoints", historique.size()
        );
    }

    // ========== Statistiques ==========
    public Map<String, Object> getStatistiquesGlobales() {
        List<Materiau> tous = repository.findAll();
        long nbMateriaux = tous.size();
        long nbAlertes = getMateriauxEnDessousSeuil().size();
        double valeurStockTotale = tous.stream()
                .mapToDouble(m -> m.getQuantite() * m.getCoutUnitaire())
                .sum();

        return Map.of(
                "nombreMateriaux", nbMateriaux,
                "nombreAlertesStock", nbAlertes,
                "valeurStockTotale", Math.round(valeurStockTotale * 100.0) / 100.0
        );
    }

    // ========== External ==========
    public List<ChantierResponse> getChantiersExternes() {
        try {
            // Appel au FeignClient qui retourne ResponseEntity<List<ChantierResponse>>
            ResponseEntity<List<ChantierResponse>> response = chantierFeignClient.getAllChantiers();

            // Vérifier si la réponse est valide et contient un body
            if (response != null && response.getBody() != null) {
                return response.getBody();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            // Log l'erreur (vous pouvez ajouter un logger)
            System.err.println("Erreur lors de l'appel au service chantier: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}