# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Build l'application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./


EXPOSE 5001

CMD ["npm", "run", "start:prod"]
