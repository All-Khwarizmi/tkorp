# TKORP - API de Gestion d'Animaux

API GraphQL pour le système de gestion d'animaux de compagnie, construite avec NestJS.

## 🌐 Démo en Direct

[Voir la Démo](https://tkorp-production.up.railway.app/graphql)

## 🔗 Dépôts

- [Dépôt Frontend](https://github.com/All-Khwarizmi/tkorp-client)
- [Dépôt Backend](https://github.com/All-Khwarizmi/tkorp)

## 🏗️ Architecture

Ce projet suit une architecture moderne et évolutive :

- **Framework** : NestJS
- **API** : GraphQL
- **Base de données** : MySQL
- **ORM** : TypeORM
- **Validation** : class-validator
- **Tests** : Jest
- **Déploiement** : Railway

## 📁 Structure du Projet

```
├── src/
│   ├── animal/              # Module de gestion des animaux
│   │   ├── dto/            # Objets de transfert de données
│   │   ├── entities/       # Entités de base de données
│   │   └── interfaces/     # Interfaces TypeScript
│   ├── person/             # Module de gestion des personnes
│   │   ├── dto/           
│   │   ├── entities/      
│   │   └── interfaces/     
│   ├── common/             # Composants partagés
│   │   └── pagination/     # Logique de pagination
│   ├── config/             # Configuration
│   │   └── database/       # Configuration de la base de données
│   ├── scripts/            # Scripts utilitaires
│   └── app.module.ts       # Module principal
├── test/                   # Tests e2e
└── db/                     # Scripts SQL et migrations
```

## ✨ Fonctionnalités

### Gestion des Animaux
- CRUD complet pour les animaux
- Pagination et tri des résultats
- Filtrage par espèce et âge
- Relations avec les propriétaires

### Gestion des Propriétaires
- CRUD complet pour les propriétaires
- Association avec les animaux
- Validation des données

### Statistiques Avancées
- Recherche de l'animal le plus âgé
- Statistiques des espèces
- Analyse des propriétaires
- Records de poids
- Métriques diverses

## 🚀 Démarrage

1. Cloner le dépôt :
```bash
git clone https://github.com/All-Khwarizmi/tkorp.git
cd tkorp
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Modifier les variables selon votre configuration
```

4. Initialiser la base de données :
```bash
npm run db:setup
npm run db:import
```

5. Lancer le serveur :
```bash
npm run start:dev
```

L'API sera disponible à : http://localhost:5001/graphql

## 📝 Exemples d'Utilisation

### Requêtes GraphQL

1. Liste des animaux (paginée) :
```graphql
query {
  animals(page: 1, take: 10) {
    items {
      name
      species
      breed
      owner {
        firstName
        lastName
      }
    }
    total
    hasMore
  }
}
```

2. Statistiques des espèces :
```graphql
query {
  mostCommonSpecies {
    species
    count
  }
}
```

3. Top propriétaire :
```graphql
query {
  topOwner {
    owner {
      firstName
      lastName
    }
    animalCount
  }
}
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## 🛠️ Commandes de Développement

```bash
# Développement
npm run start:dev

# Production
npm run start:prod

# Debug
npm run start:debug

# Linting
npm run lint
```

## 🧬 Conventions de Code

- TypeScript strict
- Architecture modulaire NestJS
- Tests unitaires pour les services
- Documentation GraphQL complète
- Validation des données avec class-validator
- ESLint pour la qualité du code
- Prettier pour le formatage

## 📦 Dépendances Principales

- NestJS
- GraphQL
- TypeORM
- MySQL
- class-validator
- Jest
- ts-node

## 📋 Roadmap

### Documentation
- [ ] Documentation Swagger/OpenAPI
- [ ] Amélioration des commentaires
- [ ] Exemples d'utilisation détaillés

### Tests
- [ ] Augmentation de la couverture
- [ ] Tests e2e complets
- [ ] Tests d'intégration

### Monitoring
- [ ] Logging structuré
- [ ] Métriques de performance
- [ ] Tracking des erreurs

## 🤝 Contribution

1. Forkez le dépôt
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
