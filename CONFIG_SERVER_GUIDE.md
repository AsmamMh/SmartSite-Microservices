# SmartSite Microservices - Architecture Centralisée

## 📋 Vue d'ensemble

Cette architecture utilise **Spring Cloud Config Server** pour centraliser la gestion des configurations et **Docker Compose** pour orchestrer tous les services.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  API Gateway (8080)                  │
│         (Routes vers tous les microservices)         │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    ▼            ▼            ▼              ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐
│Service │  │Service │  │Service │  │  Chantier  │
│Materiau│  │Projet  │  │ User   │  │   (8083)   │
│(8086)  │  │(8085)  │  │(8084)  │  └────────────┘
└───┬────┘  └───┬────┘  └───┬────┘
    │          │           │
    └──────────┼───────────┘
               │
         ┌─────▼─────┐
         │   MySQL   │
         │  (3306)   │
         └───────────┘

┌──────────────────────────────────────────────────────┐
│         Config Server (8888)  - CENTRALISÉ          │
│  • service-materiau.yml                              │
│  • service-projet.yml                                │
│  • service-user.yml                                  │
│  • api-gateway.yml                                   │
│  • chantier.yml                                      │
│  • eureka-server.yml                                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│     Eureka Server (8761) - Service Discovery        │
│         (Tous les services s'enregistrent)           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            RabbitMQ (5672) - Message Broker         │
├──────────────────────────────────────────────────────┤
│         Management UI disponible (15672)             │
└──────────────────────────────────────────────────────┘
```

## 🚀 Démarrage rapide

### Prérequis
- Docker Desktop (version 20.10+)
- Au minimum 8GB RAM disponible
- Au minimum 20GB espace disque

### Lancer tous les services

```bash
# 1. Se positionner dans le répertoire racine
cd c://Users/gigabyte\ g5/Desktop/microservice/SmartSite-Microservices

# 2. Démarrer les containers
docker-compose up -d

# 3. Vérifier le statut
docker-compose ps

# 4. Voir les logs
docker-compose logs -f

# 5. Arrêter les services
docker-compose down
```

## 📊 Services et Ports

| Service | Port | URL | Fonction |
|---------|------|-----|----------|
| **API Gateway** | 8080 | http://localhost:8080 | Point d'entrée principal |
| **Eureka Server** | 8761 | http://localhost:8761 | Service Discovery GUI |
| **Config Server** | 8888 | http://localhost:8888 | Gestion centralisée des configs |
| **Service Materiau** | 8086 | http://localhost:8086 | Gestion des matériaux |
| **Service Projet** | 8085 | http://localhost:8085 | Gestion des projets |
| **Service User** | 8084 | http://localhost:8084 | Gestion des utilisateurs |
| **Chantier** | 8083 | http://localhost:8083 | Gestion des chantiers |
| **MySQL** | 3306 | localhost:3306 | Base de données |
| **RabbitMQ** | 5672 | localhost:5672 | Message Broker |
| **RabbitMQ UI** | 15672 | http://localhost:15672 | RabbitMQ Management |

**Credentials RabbitMQ:**
- Username: `chedly`
- Password: `chedly`

**Credentials MySQL:**
- Root user: `root`
- Password: `chedly`
- Database: `chedlyRebai4twin5_db`

## 🔧 Configuration Centralisée

Toutes les configurations sont dans `config-server/src/main/resources/config/`:

### Structure des fichiers de configuration

Chaque service a un fichier YAML dédié:

```
config-server/src/main/resources/config/
├── service-materiau.yml
├── service-projet.yml
├── service-user.yml
├── api-gateway.yml
├── chantier.yml
└── eureka-server.yml
```

### Modifier une configuration

1. **Éditer le fichier YAML** dans `config-server/src/main/resources/config/`
2. **Rebuilder le config-server:**
   ```bash
   docker-compose up -d --build config-server
   ```
3. **Redémarrer les services dépendants:**
   ```bash
   docker-compose restart service-materiau service-projet service-user chantier api-gateway
   ```

## 🐳 Dockerfiles

Chaque service Java a un **Dockerfile multi-stage**:
- **Stage 1:** Compilation Maven
- **Stage 2:** Runtime basé sur Eclipse Temurin 23 JRE

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-23 as builder
# ...compile...

# Stage 2: Runtime
FROM eclipse-temurin:23-jre
# ...run...
```

## 🔄 Communication Inter-Services

### Via Service Discovery (Eureka)

```java
// Dans les services
@FeignClient(name = "service-materiau")
public interface MavClient {
    @GetMapping("/api/materiau")
    List<Materiau> getMateriau();
}
```

Host: `http://service-materiau:8086`

### Via API Gateway

Les requêtes passent par l'API Gateway avec routing automatique:

```
http://localhost:8080/materiau/** → http://service-materiau:8086/**
http://localhost:8080/projet/**   → http://service-projet:8085/**
http://localhost:8080/user/**     → http://service-user:8084/**
http://localhost:8080/chantier/** → http://chantier:8083/**
```

## 📝 Logs et Monitoring

### Voir les logs en temps réel
```bash
# Tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f service-materiau

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Health Check

```bash
# Vérifier l'état de santé du Config Server
curl http://localhost:8888/actuator/health

# Vérifier Eureka
curl http://localhost:8761/actuator/health

# Services enregistrés
curl http://localhost:8761/eureka/apps
```

## 🛠️ Troubleshooting

### Les services ne trouvent pas le Config Server

```bash
# Vérifier que le config-server est en cours d'exécution
docker-compose ps config-server

# Vérifier la connectivité
docker exec service-materiau ping config-server
```

### Problème de connexion MySQL

```bash
# Vérifier que MySQL est opérationnel
docker exec mysql-container mysql -u root -pchedly -e "SELECT 1"

# Redémarrer MySQL
docker-compose restart mysql
```

### Port déjà utilisé

```bash
# Modifier le mappage dans docker-compose.yaml
# Exemple: "8080:8080" → "8090:8080"

# Puis redémarrer
docker-compose down
docker-compose up -d
```

## 📚 Ressources Utiles

- [Spring Cloud Config Documentation](https://spring.io/projects/spring-cloud-config)
- [Eureka Documentation](https://github.com/Netflix/eureka/wiki)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

## 🔐 Sécurité (Améliorations recommandées)

- [ ] Ajouter SSL/TLS sur les endpoints
- [ ] Implémenter l'authentification OAuth2
- [ ] Chiffrer les secrets dans le Config Server
- [ ] Ajouter les policies de CORS
- [ ] Configurer les rate limiters
- [ ] Ajouter les logs d'audit

## 📦 Variables d'environnement

Configuration via `docker-compose.yaml`:

```yaml
environment:
  - SPRING_CONFIG_URI=http://config-server:8888
  - SPRING_PROFILES_ACTIVE=default
```

## 🎯 Prochaines étapes

1. ✅ Configuration centralisée avec Config Server
2. ✅ Containerisation complète
3. [ ] Ajouter CI/CD (Jenkins/GitLab CI)
4. [ ] Implémenter la résilience (Circuit Breaker)
5. [ ] Monitoring (Prometheus + Grafana)
6. [ ] Logging agrégé (ELK Stack)
7. [ ] Déploiement Kubernetes

---

**Créé avec ❤️ pour SmartSite Microservices**
