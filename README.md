# TKORP - API de Gestion d'Animaux

API GraphQL de gestion d'animaux de compagnie avec NestJS et MySQL.

## 🚀 Installation Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/All-Khwarizmi/tkorp.git
cd tkorp
```

### 2. Configurer l'environnement
```bash
# Créer le fichier .env.local
cp .env.example .env.local

# Le contenu du .env.local doit être :
DATABASE_URL=mysql://root:empty@localhost:3306/tkorp
PORT=5001
```

### 3. Lancer MySQL avec Docker
```bash
docker-compose up -d
```

### 4. Installer les dépendances
```bash
npm install
```

### 5. Importer les données de test
```bash
npm run db:import
```

### 6. Lancer l'application
```bash
npm run start:dev

# L'API est disponible sur http://localhost:5001/graphql
```

## 🧪 Tests

Pour démontrer les bonnes pratiques de développement, voici quelques tests clés :

```bash
# Tests unitaires
npm test

# Tests spécifiques
npm test animal.service
npm test person.service

# Tests e2e
npm run test:e2e
```

### Exemples de Tests

```typescript
// animal.service.spec.ts
describe('AnimalService', () => {
  it('should return the oldest animal', async () => {
    const result = await service.findOldest();
    expect(result.age).toBeGreaterThan(10);
  });

  it('should return most common species', async () => {
    const result = await service.findMostCommonSpecies();
    expect(result[0].count).toBeGreaterThan(100);
  });
});

// person.service.spec.ts
describe('PersonService', () => {
  it('should find person with most animals', async () => {
    const result = await service.findWithMostAnimals();
    expect(result.animals.length).toBeGreaterThan(3);
  });
});
```

## 📊 Analyse des Données

### 1. Animal le plus âgé (15 ans)
- Rocky (Flemish Giant Rabbit) - Propriétaire : Emma Johnson
- Luna (Persian Cat) - Propriétaire : William Taylor
- Max (Golden Retriever) - Propriétaire : Oliver Wilson

### 2. Espèces les plus représentées
1. Bird : 179 animaux
2. Cat : 165 animaux
3. Dog : 156 animaux

### 3. Top propriétaires d'animaux
1. Sophia Brown : 6 animaux
2. Emma Johnson : 5 animaux
3. William Taylor : 5 animaux

### 4. Top propriétaires de chats
1. Sarah White : 4 chats
2. Emma Johnson : 3 chats
3. Oliver Wilson : 3 chats

### 5. Animal le plus lourd
- Chloe (Poodle, 49.937 kg) - Propriétaire : Emma Smith

### 6. Groupes d'animaux les plus lourds
1. Sophia Brown : 172.152 kg (6 animaux)
2. William Taylor : 165.847 kg (5 animaux)
3. Emma Johnson : 158.623 kg (5 animaux)

## 📝 Exemples GraphQL

```graphql
# Liste des animaux
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

# Statistiques
query {
  mostCommonSpecies {
    species
    count
  }
  oldestAnimal {
    name
    species
    dateOfBirth
  }
}
```

## 🔗 Liens

- [Frontend Repository](https://github.com/All-Khwarizmi/tkorp-client)
- [Demo API](https://tkorp-production.up.railway.app/graphql)
