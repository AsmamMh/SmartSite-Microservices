# SmartSite Microservices

## Nouveau composant: Config Server

Un serveur de configuration centralise maintenant les propriétés partagées de l'architecture.

- Service: `config-server`
- Port: `8888`
- Backend: `native` (fichiers embarqués dans `config-server/src/main/resources/config-repo`)

## Démarrage recommandé

1. Démarrer `config-server`
2. Démarrer `eureka-server`
3. Démarrer les microservices métier
4. Démarrer `api-gateway`

## Exemples de lancement

```bash
cd config-server && mvn spring-boot:run
```

```bash
cd eureka-server && mvn spring-boot:run
```

Chaque microservice est configuré avec:

```properties
spring.config.import=optional:configserver:http://localhost:8888
```

Le préfixe `optional:` évite de bloquer le démarrage local si le Config Server est arrêté.
