# Micro-service Gestion des Chantiers – SmartSite

## 📌 Description
Ce micro-service fait partie du projet **SmartSite**, une application basée sur une architecture **Micro-Services** destinée à la gestion intelligente des chantiers de construction.

Le micro-service **Gestion des Chantiers** permet de créer, consulter, modifier et suivre les chantiers (sites) avec leurs informations principales.

---

## 🎯 Objectifs
- Gérer les chantiers de construction
- Centraliser les informations clés d’un chantier
- Suivre l’état et le budget des chantiers
- Fournir des API REST consommables par le Front-end

---

## 👤 Acteurs concernés
- Directeur des travaux
- Chef de projet
- Chef de chantier
- Directeur

---

## ⚙️ Fonctionnalités principales
- Création d’un chantier
- Modification d’un chantier
- Suppression d’un chantier
- Consultation de la liste des chantiers
- Consultation d’un chantier par ID
- Gestion du statut du chantier (EN_COURS, EN_PAUSE, TERMINE)

---

## 🧱 Architecture
- Architecture **Micro-Services**
- Communication via **API REST**
- Base de données dédiée au micro-service

---

## 🛠️ Technologies utilisées
- **Back-end** : Spring Boot
- **Langage** : Java
- **ORM** : Spring Data JPA / Hibernate
- **Base de données** : MySQL
- **Build Tool** : Gradle
- **Tests API** : Postman



spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
