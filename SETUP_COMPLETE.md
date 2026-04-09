# ✅ Configuration Centralisée - Résumé & Étapes Finales

## 🎯 Ce qui a été créé

### 1️⃣ Config Server (✓ Complet)
- ✅ Service `config-server` créé
- ✅ 6 fichiers YAML de configuration
- ✅ Dockerfile pour containerisation
- ✅ Port: 8888

### 2️⃣ Dockerisation Complète (✓ Complet)
- ✅ Dockerfiles créés pour tous les services Java
- ✅ docker-compose.yaml mis à jour
- ✅ Tous les services inclus
- ✅ Network Docker créé pour la communication

### 3️⃣ Bootstrap Files (✓ Complet)
- ✅ bootstrap.yml créés pour la connexion au Config Server
- ✅ Chemins configurés: `http://config-server:8888`

## ⚠️ Étapes Manuelles Requises

### IMPORTANT: Ajouter spring-cloud-config-client aux pom.xml

Les services suivants ont besoin de cette dépendance. Pour les services où l'ajout automatique a échoué, **ajoutez manuellement**:

#### Pour: `service-projet/pom.xml`, `service-user/pom.xml`, `api-gateway/pom.xml`

Trouvez cette section:
```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>

        <dependency>
```

Et remplacez par:
```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>

        <dependency>
```

## 🚀 Démarrage Complet

### Méthode 1: Script Automatique (Windows)
```cmd
double-clic sur start.bat
```

### Méthode 2: Script Automatique (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Méthode 3: Manuel
```bash
# Aller au répertoire racine
cd c://Users/gigabyte\ g5/Desktop/microservice/SmartSite-Microservices

# Arrêter les anciens containers
docker-compose down

# Démarrer tout
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

## 📋 Vérification du Démarrage

### Étape 1: Vérifier les containers
```bash
docker-compose ps
```

Vous devriez voir 8 containers en état `Up`:
```
NAME                IMAGE                  STATUS
config-server       smartsite_config-server       Up 2 minutes
eureka-server       smartsite_eureka-server       Up 2 minutes
mysql-container     mysql:latest               Up 3 minutes
rabbitmq            rabbitmq:4-management        Up 3 minutes
service-materiau    smartsite_service-materiau   Up 1 minute
service-projet      smartsite_service-projet     Up 1 minute
service-user        smartsite_service-user       Up 1 minute
api-gateway         smartsite_api-gateway        Up 1 minute
```

### Étape 2: Vérifier les services démarrés

```bash
# Config Server prêt?
curl http://localhost:8888/actuator/health

# Eureka prêt?
curl http://localhost:8761/actuator/health

# MySQL prêt?
docker exec mysql-container mysql -u root -pchedly -e "SELECT 1"
```

### Étape 3: Vérifier la configuration centralisée

```bash
# Récupérer la config de service-materiau
curl http://localhost:8888/service-materiau/default

# Résultat attendu: JSON avec configuration
{
  "name": "service-materiau",
  "profiles": ["default"],
  "label": null,
  "version": null,
  "state": null,
  "propertySources": [...]
}
```

## 🔍 URLs Utiles

| Service | URL | Credentials |
|---------|-----|-------------|
| **Eureka Dashboard** | http://localhost:8761 | - |
| **RabbitMQ** | http://localhost:15672 | chedly / chedly |
| **Config Server** | http://localhost:8888 | - |
| **API Gateway** | http://localhost:8080 | - |
| **Service Materiau** | http://localhost:8086 | - |
| **Service Projet** | http://localhost:8085 | - |
| **Service User** | http://localhost:8084 | - |
| **Chantier** | http://localhost:8083 | - |

## 📝 Logs et Debugging

### Voir tous les logs
```bash
docker-compose logs -f
```

### Logs d'un service spécifique
```bash
docker-compose logs -f service-materiau
docker-compose logs -f config-server
docker-compose logs -f eureka-server
```

### Vérifier la connectivité réseau
```bash
# Depuis un container, pinguer un autre
docker exec service-materiau ping config-server
docker exec service-materiau ping mysql
```

## 🛠️ Modification des Configurations

### Pour modifier une configuration:

1. **Éditer le fichier** dans `config-server/src/main/resources/config/`
   - Ex: `config-server/src/main/resources/config/service-materiau.yml`

2. **Rebuilder le Config Server**
   ```bash
   docker-compose up -d --build config-server
   ```

3. **Redémarrer les services affectés**
   ```bash
   docker-compose restart service-materiau
   ```

4. **Vérifier la nouvelle config**
   ```bash
   curl http://localhost:8888/service-materiau/default | jq .propertySources[0].source
   ```

## ❌ Troubleshooting

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs service-materiau

# Vérifier que le config-server est prêt
docker-compose logs config-server

# Vérifier que MySQL répond
docker exec mysql-container mysqladmin ping -u root -pchedly
```

### Port déjà utilisé
```bash
# Trouver le processus sur le port (ex: 8888)
lsof -i :8888

# Ou changer le port dans docker-compose.yaml
# Exemple: "8888:8888" → "8889:8888"
```

### Services qui ne se trouvent pas entre eux
```bash
# Vérifier que tous les containers sont sur le même réseau
docker network inspect smartsite-microservices_smartsite-network

# Vérifier la résolution DNS
docker exec service-materiau nslookup config-server
```

## 📦 Prochaines Étapes

1. **Tester une requête via API Gateway**
   ```bash
   curl http://localhost:8080/materiau/api/materiau
   ```

2. **Vérifier l'enregistrement Eureka**
   - Aller sur http://localhost:8761
   - Vérifier que tous les services sont listés

3. **Monitorer avec RabbitMQ**
   - Aller sur http://localhost:15672
   - Username: `chedly`, Password: `chedly`

4. **Ajouter la persistence des configurations**
   - Étape future: configurer Git comme backend pour le Config Server

## ✅ Checklist Finale

- [ ] Tous les Dockerfiles sont créés
- [ ] docker-compose.yaml est complet
- [ ] Config Server a tous les fichiers YAML
- [ ] bootstrap.yml dans chaque service
- [ ] spring-cloud-config-client ajouté aux pom.xml
- [ ] Tous les containers démarrent sans erreur
- [ ] Services se trouvent entre eux via le réseau Docker
- [ ] Config Server retourne les configurations
- [ ] Eureka enregistre tous les services
- [ ] API Gateway route correctement les requêtes

## 📞 Support

Pour des questions sur la configuration, voir:
- `CONFIG_SERVER_GUIDE.md` - Documentation complète
- `docker-compose.yaml` - Configuration des services
- `config-server/src/main/resources/config/` - Fichiers de configuration

---

**Configuration Terminée! 🎉**
