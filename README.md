# SmartSite - Microservice de Gestion des Incidents

## Description

Ce microservice fait partie de l'écosystème SmartSite et est responsable de la gestion des incidents sur les différents sites. Il permet de déclarer, suivre, assigner et résoudre les incidents.

## Fonctionnalités

- **Déclaration d'incidents** : Création de nouveaux incidents avec titre, description, priorité
- **Suivi des incidents** : Suivi du statut (OUVERT, EN_COURS, RESOLU, FERME)
- **Assignation** : Assignation des incidents à des responsables
- **Résolution** : Enregistrement des solutions et clôture des incidents
- **Recherche et filtrage** : Recherche par site, statut, priorité, dates
- **Statistiques** : Comptage d'incidents par statut et priorité

## Architecture

### Entités

- **Incident** : Entité principale avec les attributs suivants :
  - `id` : Identifiant unique
  - `titre` : Titre de l'incident
  - `description` : Description détaillée
  - `priorite` : BASSE, MOYENNE, HAUTE, CRITIQUE
  - `statut` : OUVERT, EN_COURS, RESOLU, FERME
  - `siteId` : Identifiant du site concerné
  - `declarePar` : Personne ayant déclaré l'incident
  - `assigneA` : Personne assignée à la résolution
  - `dateDeclaration` : Date de déclaration (auto)
  - `dateResolution` : Date de résolution
  - `resolution` : Description de la résolution

### API REST

#### Incidents
- `POST /api/incidents` - Créer un incident
- `GET /api/incidents` - Lister tous les incidents
- `GET /api/incidents/{id}` - Obtenir un incident par ID
- `PUT /api/incidents/{id}` - Mettre à jour un incident
- `DELETE /api/incidents/{id}` - Supprimer un incident

#### Filtres et Recherche
- `GET /api/incidents/site/{siteId}` - Incidents par site
- `GET /api/incidents/statut/{statut}` - Incidents par statut
- `GET /api/incidents/priorite/{priorite}` - Incidents par priorité
- `GET /api/incidents/declare-par/{declarePar}` - Incidents par déclarant
- `GET /api/incidents/assigne-a/{assigneA}` - Incidents par assigné
- `GET /api/incidents/date-range` - Incidents par plage de dates
- `GET /api/incidents/site/{siteId}/statut/{statut}` - Incidents par site et statut

#### Actions
- `PUT /api/incidents/{id}/assigner` - Assigner un incident
- `PUT /api/incidents/{id}/statut` - Changer le statut
- `PUT /api/incidents/{id}/resoudre` - Résoudre un incident

#### Statistiques
- `GET /api/incidents/statistiques/statut/{statut}` - Nombre par statut
- `GET /api/incidents/statistiques/priorite/{priorite}` - Nombre par priorité

## Configuration

### Base de données
- **Production** : MySQL (`smartsite_incidents`)
- **Tests** : H2 (mémoire)

### Ports
- **Service** : 8082
- **Base de données MySQL** : 3306

## Démarrage

### Prérequis
- Java 17+
- MySQL 8.0+
- Gradle 7+

### Configuration MySQL
```sql
CREATE DATABASE smartsite_incidents;
```

### Lancement
```bash
# Compiler
./gradlew build

# Lancer le service
./gradlew bootRun
```

### Tests
```bash
# Lancer les tests
./gradlew test
```

## Exemples d'utilisation

### Créer un incident
```bash
curl -X POST http://localhost:8082/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Panne de climatisation",
    "description": "La climatisation est en panne dans le bureau principal",
    "priorite": "HAUTE",
    "siteId": "SITE-001",
    "declarePar": "john.doe"
  }'
```

### Assigner un incident
```bash
curl -X PUT http://localhost:8082/api/incidents/1/assigner \
  -H "Content-Type: application/json" \
  -d '{"assigneA": "technicien.expert"}'
```

### Résoudre un incident
```bash
curl -X PUT http://localhost:8082/api/incidents/1/resoudre \
  -H "Content-Type: application/json" \
  -d '{"resolution": "Système de climatisation réparé"}'
```

## Technologies

- **Spring Boot 4.0.2**
- **Spring Data JPA**
- **Spring Web MVC**
- **Spring Validation**
- **MySQL**
- **Lombok**
- **JUnit 5**

## Déploiement

Le microservice est configuré pour s'exécuter sur le port 8082 et peut être déployé :
- Localement avec `./gradlew bootRun`
- En tant que JAR exécutable
- Dans un conteneur Docker (à ajouter)
- Sur une plateforme cloud (à configurer)
