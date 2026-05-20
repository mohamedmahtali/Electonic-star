# Electronic Star — Comparateur de prix composants informatiques

Monorepo fullstack : Next.js 15 (frontend) + Spring Boot 3 (backend).

## Stack

| Couche | Techno |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, TypeScript, React Query |
| Backend | Spring Boot 3, Java 21, JPA/Hibernate |
| Base de données | PostgreSQL 16 |
| Cache | Redis 7 |
| Crawler | Jsoup + Amazon PA-API + Cdiscount API |

## Lancer en local

### Prérequis
- Docker + Docker Compose
- Java 21
- Node.js 20+

### Démarrer l'infrastructure
```bash
docker compose up postgres redis -d
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
API disponible sur `http://localhost:8080`

### Frontend (à venir)
```bash
cd frontend
npm install
npm run dev
```

## API REST

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/products/{slug}` | Fiche produit complète |
| GET | `/api/products?category=gpu` | Liste par catégorie |
| GET | `/api/products/{id}/prices` | Prix multi-boutiques |
| GET | `/api/products/{id}/prices/history` | Historique des prix |
| GET | `/api/categories` | Arbre des catégories |
| GET | `/api/search?q=rtx+4070` | Recherche produits |
| GET | `/api/compare?ids=uuid1,uuid2` | Comparateur |

## Architecture base de données

Entités principales : `brands` → `products` → `product_descriptions` (JSONB polymorphe par type de composant), `prices`, `price_history`, `categories` (hiérarchique), `tags`.

## Variables d'environnement

```env
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
AMAZON_PARTNER_TAG=...
CDISCOUNT_APP_KEY=...
CDISCOUNT_LOGIN=...
CDISCOUNT_PASSWORD=...
```
