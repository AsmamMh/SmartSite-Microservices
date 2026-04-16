package tn.esprit.microservice.servicemateriau.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    private Long materiauId;
    private Integer heures;  // Nombre d'heures pour la prédiction
}