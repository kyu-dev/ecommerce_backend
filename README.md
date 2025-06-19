# Documentation du Projet E-commerce Backend

## Table des Matières

1. [Introduction](#introduction)
2. [Structure du Projet](#structure-du-projet)
3. [Fonctionnalités](#fonctionnalités)
   - [Gestion des Utilisateurs](#gestion-des-utilisateurs)
   - [Gestion des Produits](#gestion-des-produits)
   - [Gestion des Paniers](#gestion-des-paniers)
   - [Gestion des Commandes](#gestion-des-commandes)
4. [Routes API](#routes-api)
   - [Routes d'Authentification](#routes-dauthentification)
   - [Routes des Produits](#routes-des-produits)
   - [Routes des Paniers](#routes-des-paniers)
   - [Routes des Commandes](#routes-des-commandes)
5. [Technologies Utilisées](#technologies-utilisées)
6. [Installation et Configuration](#installation-et-configuration)

## Introduction

Ce projet est un backend pour une application e-commerce. Il est conçu pour gérer les utilisateurs, les produits, les paniers et les commandes. Le backend est développé en TypeScript avec Express.js et utilise Prisma comme ORM pour interagir avec une base de données PostgreSQL.

## Structure du Projet

Le projet est structuré comme suit :

- `src/` : Contient le code source de l'application.
  - `auth/` : Gestion de l'authentification.
  - `controllers/` : Contrôleurs pour gérer les requêtes.
  - `db/` : Configuration de la base de données et client Prisma.
  - `middleware/` : Middlewares pour la gestion des erreurs et autres.
  - `routes/` : Définition des routes API.
  - `server.ts` : Point d'entrée de l'application.
- `prisma/` : Contient les migrations et le schéma de la base de données.
- `test/` : Tests unitaires et d'intégration.

## Fonctionnalités

### Gestion des Utilisateurs

- **Inscription** : Les utilisateurs peuvent s'inscrire avec un nom, un email et un mot de passe.
- **Connexion** : Les utilisateurs peuvent se connecter avec leur email et mot de passe.

### Gestion des Produits

- **Création de Produits** : Les administrateurs peuvent créer de nouveaux produits.
- **Récupération de Produits** : Les utilisateurs peuvent récupérer la liste des produits disponibles.

### Gestion des Paniers

- **Ajout d'Articles** : Les utilisateurs peuvent ajouter des articles à leur panier.
- **Suppression d'Articles** : Les utilisateurs peuvent supprimer des articles de leur panier.
- **Modification de Quantité** : Les utilisateurs peuvent modifier la quantité d'un article dans leur panier.
- **Vider le Panier** : Les utilisateurs peuvent vider leur panier.

### Gestion des Commandes

- **Création de Commande** : Les utilisateurs peuvent créer une commande à partir de leur panier.
- **Récupération de Commandes** : Les utilisateurs peuvent récupérer la liste de leurs commandes.

## Routes API

### Routes d'Authentification

- `POST /register` : Inscription d'un nouvel utilisateur.
- `POST /login` : Connexion d'un utilisateur.

### Routes des Produits

- `POST /products` : Création d'un nouveau produit.
- `GET /products` : Récupération de la liste des produits.

### Routes des Paniers

- `GET /cart/:userId` : Récupération du panier d'un utilisateur.
- `POST /cart/:userId` : Ajout d'articles au panier.
- `DELETE /cart/:userId/item/:productId` : Suppression d'un article du panier.
- `PUT /cart/:userId` : Modification d'un produit dans le panier.
- `DELETE /cart/:userId/clearCart` : Vider le panier.

### Routes des Commandes

- `POST /order/:userId` : Création d'une commande.
- `GET /order/:userId` : Récupération des commandes d'un utilisateur.

## Technologies Utilisées

- **TypeScript** : Langage de programmation.
- **Express.js** : Framework pour construire l'API.
- **Prisma** : ORM pour interagir avec la base de données.
- **PostgreSQL** : Base de données relationnelle.
- **Swagger** : Documentation de l'API.

## Installation et Configuration

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-repo/ecommerce_backend.git
   cd ecommerce_backend
   ```
2. **Installer les dépendances** :
   ```bash
   pnpm install
   ```
3. **Configurer la base de données** :
   - Créer un fichier `.env` et ajouter la configuration de la base de données.
   - Exécuter les migrations Prisma :
     ```bash
     pnpm prisma migrate dev
     ```
4. **Démarrer le serveur** :
   ```bash
   pnpm dev
   ```
