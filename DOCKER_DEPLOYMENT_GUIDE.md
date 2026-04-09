# 🚀 Guide de Déploiement Complet - Docker Compose

## 📋 Prérequis

- ✅ Docker Desktop 20.10+
- ✅ Docker Compose 2.0+
- ✅ 8GB RAM disponible minimum
- ✅ 20GB espace disque

## 🔄 Mise à Jour du docker-compose.yaml

### Étape 1: Remplacer le fichier docker-compose

```bash
# Supprimer l'ancien fichier
rm docker-compose.yaml

# Renommer le nouveau
ren docker-compose-updated.yaml docker-compose.yaml
# Ou sur MacOS/Linux:
# mv docker-compose-updated.yaml docker-compose.yaml
```

## 📊 Configuration Récapitulative

| Service | Container | Port | Dockerfile |
|---------|-----------|------|-----------|
| **MySQL** | mysql-container | 3306 | Image officielle |
| **RabbitMQ** | rabbitmq | 5672, 15672 | Image officielle |
| **Config Server** | config-server | 8888 | ✓ Présent |
| **Eureka Server** | eureka-server | 8761 | ✓ Présent |
| **Service Materiau** | service-materiau | 8086 | ✓ Présent |
| **Service Projet** | service-gestion-projet | **8083** | ✓ Présent |
| **Service User** | service-gestion-user | **8082** | ✓ Présent |
| **Chantier** | service-gestion-chantier | **8089** | ✓ Présent |
| **Incidents** | service-gestion-incidents | **30332** | ✓ Présent |
| **API Gateway** | api-gateway | **8070** | ✓ Présent |

## 🎯 Ordre de Démarrage Automatisé

Le docker-compose.yaml gère les dépendances avec `depends_on` et `healthcheck`:

1. **Infrastructure** (démarre en parallèle)
   - MySQL (3306)
   - RabbitMQ (5672, 15672)

2. **Config & Discovery** (attend infrastructure)
   - Config Server (8888) ← MySQL + RabbitMQ
   - Eureka Server (8761) ← Config Server

3. **Microservices** (attendent découverte)
   - Service Materiau (8086)
   - Service Projet (8083)
   - Service User (8082)
   - Chantier (8089)
   - Incidents (30332)
   - API Gateway (8070)

## 🚀 Démarrage Complet

### Method 1: Script Windows (Recommandé)
```bash
start.bat
```

### Method 2: Script Linux/MacOS
```bash
chmod +x start.sh
./start.sh
```

### Method 3: Manuel
```bash
# Arrêter les anciens containers
docker-compose down

# Construire toutes les images
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## ✅ Vérifications Après Démarrage

### 1. Vérifier les containers

```bash
docker-compose ps
```

Tous les containers doivent être en état **Up**

### 2. Vérifier Eureka (après ~30 secondes)

```bash
curl http://localhost:8761
```

Ou ouvrir: http://localhost:8761

**Vous devez voir 9 services enregistrés:**
- SERVICE-MATERIAU (8086)
- SERVICE-GESTION-PROJET (8083)
- SERVICE-GESTION-USER (8082)
- SERVICE-GESTION-CHANTIER (8089)
- SERVICE-GESTION-INCIDENTS (30332)
- CONFIG-SERVER (8888)
- API-GATEWAY (8070)
- EUREKA-SERVER (8761)

### 3. Vérifier le Config Server

```bash
curl http://localhost:8888/actuator/health
```

Response attendue:
```json
{"status":"UP"}
```

### 4. Récupérer une configuration

```bash
curl http://localhost:8888/service-materiau/default | jq .
```

### 5. Tester l'API Gateway

```bash
# Via Load Balancer
curl http://localhost:8070/materiau/actuator/health
curl http://localhost:8070/projet/actuator/health
curl http://localhost:8070/user/actuator/health
curl http://localhost:8070/chantier/actuator/health
```

## 📊 Ports et Accès

| Service | URL | Credentials |
|---------|-----|-------------|
| **Eureka Dashboard** | http://localhost:8761 | - |
| **Config Server** | http://localhost:8888 | - |
| **RabbitMQ UI** | http://localhost:15672 | chedly/chedly |
| **API Gateway** | http://localhost:8070 | - |
| **MySQL** | localhost:3306 | root/chedly |

## 🛑 Gestion des Services

### Arrêter tous les services
```bash
docker-compose down
```

### Redémarrer un service spécifique
```bash
docker-compose restart service-materiau
docker-compose restart api-gateway
docker-compose restart config-server
```

### Voir les logs d'un service
```bash
docker-compose logs -f service-materiau
docker-compose logs -f api-gateway
docker-compose logs -f config-server
```

### Voir les 100 dernières lignes
```bash
docker-compose logs --tail=100 service-materiau
```

## 🔧 Troubleshooting

### Port déjà utilisé

```bash
# Trouver le processus sur le port (8888)
netstat -ano | findstr :8888

# Ou avec lsof sur Linux/MacOS
lsof -i :8888
```

**Solution:** Modifier le mapping dans docker-compose.yaml
```yaml
ports:
  - "8889:8888"  # Utiliser un autre port externe
```

### Les services ne démarrent pas

```bash
# Voir les logs complets
docker-compose logs

# Rebuilder les images
docker-compose build --no-cache

# Redémarrer
docker-compose down
docker-compose up -d
```

### Les services ne se trouvent pas dans Eureka

```bash
# Vérifier la connectivité réseau
docker network ls
docker network inspect smartsite-network

# Vérifier que les healthchecks passent
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Config Server ne trouve pas les fichiers YAML

```bash
# Vérifier l'image Config Server
docker logs config-server

# Les fichiers doivent être dans:
# config-server/src/main/resources/config/

# Vérifier qu'ils existent:
ls -la config-server/src/main/resources/config/
```

## 📝 Modification de Configurations

### Pour modifier une configuration

1. **Éditer le fichier YAML**
   ```bash
   # Exemple: modifier la config de service-materiau
   vim config-server/src/main/resources/config/service-materiau.yml
   ```

2. **Rebuilder le Config Server**
   ```bash
   docker-compose build --no-cache config-server
   docker-compose up -d config-server
   ```

3. **Redémarrer les services affectés**
   ```bash
   docker-compose restart service-materiau
   ```

4. **Vérifier la nouvelle config**
   ```bash
   curl http://localhost:8888/service-materiau/default | jq .
   ```

## 🔐 Credentials par défaut

### MySQL
- **User:** root
- **Password:** chedly
- **Database:** chedlyRebai4twin5_db

### RabbitMQ
- **User:** chedly
- **Password:** chedly

## 📦 Architecture Docker

```
SmartSite-Microservices/
├── config-server/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/resources/config/
│       ├── service-materiau.yml
│       ├── service-projet.yml
│       ├── service-user.yml
│       ├── chantier.yml
│       ├── api-gateway.yml
│       └── eureka-server.yml
├── eureka-server/
│   ├── Dockerfile
│   └── pom.xml
├── service-materiau/
│   ├── Dockerfile
│   └── pom.xml
├── api-gateway/
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yaml (NOUVEAU)
├── .dockerignore
└── start.bat / start.sh
```

## ✅ Checklist Déploiement

- [ ] Fichier `docker-compose.yaml` remplacé
- [ ] Tous les Dockerfiles existent
- [ ] Image Docker `mysql:latest` disponible
- [ ] Image Docker `rabbitmq:4-management` disponible
- [ ] Config Server construit ✓
- [ ] Eureka Server construit ✓
- [ ] Tous les services Java construits ✓
- [ ] `docker-compose up -d` exécuté
- [ ] Tous les containers en état "Up"
- [ ] Eureka Dashboard montre 9 services
- [ ] Routes API Gateway testées

## 🎉 Succès!

Une fois que:
1. ✅ Tous les containers sont **Up**
2. ✅ Tous les services apparaissent dans **Eureka**
3. ✅ **Config Server** retourne les configurations

**Votre architecture microservices est 100% opérationnelle ! 🚀**

---

Voir aussi: `CONFIG_SERVER_GUIDE.md` et `CORRECTIONS_EUREKA.md`
