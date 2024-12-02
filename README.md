# Pet Management API

Une API GraphQL construite avec NestJS pour gérer les animaux de compagnie et leurs propriétaires.

## 🚀 Fonctionnalités

### Implémentées

- ✅ CRUD complet pour les animaux et les propriétaires
- ✅ Pagination des résultats
- ✅ Validation des données (class-validator)
- ✅ Queries spécialisées:
  - Recherche de l'animal le plus vieux
  - Statistiques des espèces les plus représentées
  - Propriétaire avec le plus d'animaux
  - Propriétaire avec le plus de chats
  - Animal le plus lourd et son propriétaire
  - Propriétaire avec le groupe d'animaux le plus lourd
- ✅ Interface GraphQL complète et documentée
- ✅ Support de tri des résultats
- ✅ Gestion des relations One-to-Many
- ✅ Script d'import de données

### Roadmap

- 📝 Documentation:
  - [ ] Ajouter une documentation Swagger/OpenAPI
  - [ ] Améliorer les commentaires dans le code
  - [ ] Ajouter des exemples d'utilisation

- 🧪 Tests:
  - [ ] Augmenter la couverture des tests unitaires
  - [ ] Ajouter des tests e2e
  - [ ] Ajouter des tests d'intégration pour les queries spécialisées

- 📊 Monitoring:
  - [ ] Implémenter un système de logging structuré
  - [ ] Ajouter des métriques de performance
  - [ ] Mettre en place un système de tracking des erreurs

## 🛠 Technologies Utilisées

- NestJS
- GraphQL
- MySQL
- TypeScript
- class-validator
- Jest

## 📦 Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier les variables dans .env selon votre configuration
```

4. Initialiser la base de données
```bash
npm run db:setup
```

5. Importer les données
```bash
npm run db:import
```

## 🚀 Démarrage

```bash
# Développement
npm run start:dev

# Production
npm run start:prod
```

L'API sera disponible à l'adresse: http://localhost:5001/graphql

## 📝 Utilisation de l'API

### Exemples de Queries

1. Obtenir la liste des animaux (paginée)
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

2. Obtenir les statistiques des espèces
```graphql
query {
  mostCommonSpecies {
    species
    count
  }
}
```

3. Trouver le propriétaire avec le plus d'animaux
```graphql
query {
  topOwner {
    owner {
      firstName
      lastName
      email
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

# Couverture des tests
npm run test:cov
```

## 📄 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
