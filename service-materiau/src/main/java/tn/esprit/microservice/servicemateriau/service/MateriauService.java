package tn.esprit.microservice.servicemateriau.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.microservice.servicemateriau.client.ChantierFeignClient;
import tn.esprit.microservice.servicemateriau.DTO.ChantierResponse;
import tn.esprit.microservice.servicemateriau.DTO.PredictionRequest;
import tn.esprit.microservice.servicemateriau.entity.Materiau;
import tn.esprit.microservice.servicemateriau.entity.MouvementStock;
import tn.esprit.microservice.servicemateriau.repository.MateriauRepository;
import tn.esprit.microservice.servicemateriau.repository.MouvementStockRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class MateriauService {

    private final MateriauRepository materiauRepository;
    private final MouvementStockRepository mouvementStockRepository;
    private final ChantierFeignClient chantierFeignClient;

    public MateriauService(MateriauRepository materiauRepository,
                           MouvementStockRepository mouvementStockRepository,
                           ChantierFeignClient chantierFeignClient) {
        this.materiauRepository = materiauRepository;
        this.mouvementStockRepository = mouvementStockRepository;
        this.chantierFeignClient = chantierFeignClient;
    }

    // ==================== CRUD ====================

    public Materiau add(Materiau m) {
        log.info("➕ Ajout matériau: {}", m.getNom());
        return materiauRepository.save(m);
    }

    public List<Materiau> getAll() {
        return materiauRepository.findAll();
    }

    public Materiau getById(Long id) {
        return materiauRepository.findById(id).orElse(null);
    }

    public Materiau update(Long id, Materiau m) {
        Materiau existing = materiauRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériau non trouvé"));
        existing.setNom(m.getNom());
        existing.setLocalisation(m.getLocalisation());
        existing.setUnite(m.getUnite());
        existing.setCoutUnitaire(m.getCoutUnitaire());
        existing.setSeuilAlerte(m.getSeuilAlerte());
        log.info("✏️ Modification matériau: {}", existing.getNom());
        return materiauRepository.save(existing);
    }

    public void delete(Long id) {
        Materiau m = getById(id);
        if (m != null) {
            m.setActif(false);
            materiauRepository.save(m);
            log.info("🗑️ Désactivation matériau: {}", m.getNom());
        }
    }

    // ==================== GESTION STOCK ====================

    public MouvementStock entreeStock(Long materiauId, Double quantite, String commentaire) {
        Materiau materiau = getById(materiauId);
        if (materiau == null) throw new RuntimeException("Matériau non trouvé");

        materiau.setQuantiteStock(materiau.getQuantiteStock() + quantite);
        materiauRepository.save(materiau);

        MouvementStock mouvement = new MouvementStock();
        mouvement.setMateriau(materiau);
        mouvement.setType("ENTREE");
        mouvement.setQuantite(quantite);
        mouvement.setCommentaire(commentaire);

        log.info("📦 Entrée: +{} {} de {}", quantite, materiau.getUnite(), materiau.getNom());
        return mouvementStockRepository.save(mouvement);
    }

    public MouvementStock sortieStock(Long materiauId, Double quantite, String commentaire) {
        Materiau materiau = getById(materiauId);
        if (materiau == null) throw new RuntimeException("Matériau non trouvé");

        if (materiau.getQuantiteStock() < quantite) {
            throw new RuntimeException("Stock insuffisant! Disponible: " + materiau.getQuantiteStock());
        }

        materiau.setQuantiteStock(materiau.getQuantiteStock() - quantite);
        materiauRepository.save(materiau);

        MouvementStock mouvement = new MouvementStock();
        mouvement.setMateriau(materiau);
        mouvement.setType("SORTIE");
        mouvement.setQuantite(quantite);
        mouvement.setCommentaire(commentaire);

        log.info("📤 Sortie: -{} {} de {}", quantite, materiau.getUnite(), materiau.getNom());
        return mouvementStockRepository.save(mouvement);
    }

    // ==================== MÉTIERS AVANCÉS ====================

    public List<Materiau> getStockFaible() {
        return materiauRepository.findStockFaible();
    }

    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        List<Materiau> all = materiauRepository.findAll();

        double valeurTotale = all.stream()
                .mapToDouble(m -> m.getQuantiteStock() * m.getCoutUnitaire())
                .sum();

        stats.put("nombreMateriaux", all.size());
        stats.put("valeurStockTotal", Math.round(valeurTotale * 100) / 100.0);
        stats.put("stockFaible", getStockFaible().size());

        return stats;
    }

    public List<Materiau> search(String keyword) {
        return materiauRepository.findByNomContainingIgnoreCase(keyword);
    }

    public List<Materiau> filterByLocalisation(String localisation) {
        return materiauRepository.findByLocalisation(localisation);
    }

    public List<MouvementStock> getHistorique(Long materiauId) {
        return mouvementStockRepository.findByMateriauIdOrderByDateMouvementDesc(materiauId);
    }

    // ==================== COMMUNICATION CHANTIER (CORRIGÉ) ====================

    public Map<String, Object> testCommunicationChantier() {
        Map<String, Object> result = new HashMap<>();
        try {
            // ✅ Changé: plus de .getBody()
            List<ChantierResponse> chantiers = chantierFeignClient.getAllChantiers();
            result.put("status", "OK");
            result.put("message", "Communication avec service-gestion-chantier réussie");
            result.put("chantiersTrouves", chantiers != null ? chantiers.size() : 0);
            log.info("✅ Communication chantier OK");
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("message", "Erreur: " + e.getMessage());
            log.error("❌ Communication chantier échouée");
        }
        return result;
    }

    public List<ChantierResponse> getChantiersExternes() {
        try {
            // ✅ Changé: plus de .getBody()
            return chantierFeignClient.getAllChantiers();
        } catch (Exception e) {
            log.error("Erreur récupération chantiers", e);
            return new ArrayList<>();
        }
    }

    // ==================== PRÉDICTION ML ====================

    public Map<String, Object> predireConsommation(PredictionRequest request) {
        Map<String, Object> result = new HashMap<>();
        Materiau materiau = getById(request.getMateriauId());

        if (materiau == null) {
            result.put("error", "Matériau non trouvé");
            return result;
        }

        LocalDateTime dernierJour = LocalDateTime.now().minusHours(24);
        List<MouvementStock> sortiesRecentes = mouvementStockRepository.findSortiesRecentes(request.getMateriauId(), dernierJour);

        double consommationParHeure = 0;
        if (!sortiesRecentes.isEmpty()) {
            double totalConsomme = sortiesRecentes.stream().mapToDouble(MouvementStock::getQuantite).sum();
            consommationParHeure = totalConsomme / 24;
        }

        double prediction = consommationParHeure * request.getHeures();

        result.put("materiau", materiau.getNom());
        result.put("stockActuel", materiau.getQuantiteStock());
        result.put("consommationParHeure", Math.round(consommationParHeure * 100) / 100.0);
        result.put("heuresPrediction", request.getHeures());
        result.put("prediction", Math.round(prediction * 100) / 100.0);
        result.put("unite", materiau.getUnite());

        if (materiau.getQuantiteStock() < prediction) {
            result.put("alerte", "ROUGE - Stock insuffisant! Prévoyez un réapprovisionnement.");
        } else if (materiau.getQuantiteStock() < prediction * 1.5) {
            result.put("alerte", "ORANGE - Stock limite, surveillez.");
        } else {
            result.put("alerte", "VERT - Stock suffisant.");
        }

        return result;
    }
}