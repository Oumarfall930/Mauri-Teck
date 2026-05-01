# 🎫 MAUTI-TICKET — Plateforme de Vente de Tickets en Ligne (Mauritanie)

Application complète de gestion et vente de tickets avec QR Code.

---

## 🗂️ Structure du projet

```
mauti-ticket/
├── backend/          → API Node.js + Express + Prisma
└── frontend/         → React + Vite + TailwindCSS
```

---

## ⚙️ Prérequis

- Node.js v18+
- PostgreSQL 14+
- npm ou yarn

---

## 🚀 Installation et démarrage

### 1. Base de données PostgreSQL

```sql
CREATE DATABASE mauti_ticket;
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# → Modifier DATABASE_URL dans .env

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Peupler la base avec les données de test
npm run db:seed

# Lancer le serveur (port 5000)
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de dev (port 5173)
npm run dev
```

Ouvrir : **http://localhost:5173**

---

## 👥 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@mauti-ticket.mr | admin123 |
| Organisateur | organisateur@mauti-ticket.mr | org123 |
| Agent | *(créé par l'organisateur)* | — |

---

## 🔐 Rôles et fonctionnalités

### 🔴 Admin
- Tableau de bord avec statistiques globales (revenus, tickets vendus, événements)
- Créer les comptes organisateurs
- Voir tous les événements et commandes
- Gérer les catégories (CRUD avec icônes et couleurs)
- Activer/désactiver les comptes

### 🟡 Organisateur
- Dashboard avec KPIs (revenus, commandes, tickets vendus)
- Créer et gérer des événements (image, date, lieu, catégorie)
- Ajouter plusieurs types de tickets (VIP, Standard, etc.) avec prix et nombre de places
- Créer des comptes agents
- Assigner des agents à des événements
- Voir les commandes avec photo du reçu de paiement
- **Valider les paiements** → génération automatique des tickets QR

### 🟢 Agent
- Voir les événements qui lui sont assignés
- **Scanner les QR codes** avec la caméra du téléphone
- Validation en temps réel (Accès autorisé / refusé)
- Statistiques d'entrée en direct (entrés / en attente / total)

### 🔵 Acheteur (sans compte obligatoire)
- Parcourir tous les événements publiés
- Filtrer par catégorie, ville, recherche
- Ajouter au panier plusieurs types de tickets
- Commander sans créer de compte (nom, email, téléphone)
- **Uploader la capture du reçu de paiement**
- Suivre sa commande par numéro
- Recevoir ses tickets QR après validation
- Afficher le QR code depuis son téléphone le jour J

---

## 🎫 Flux de commande complet

```
1. Acheteur → Sélectionne un événement et des tickets
2. Acheteur → Remplit ses coordonnées (ou se connecte)
3. Acheteur → Upload la capture du reçu bancaire
4. Organisateur → Voit la commande + photo du reçu
5. Organisateur → Clique "Valider" ✅
6. Système → Génère les tickets QR automatiquement
7. Acheteur → Reçoit ses tickets QR (visibles sur son téléphone)
8. Jour J → Acheteur montre son QR à l'agent
9. Agent → Scanne avec la caméra → ACCÈS AUTORISÉ ✅
```

---

## 🔌 API Endpoints principaux

### Auth
- `POST /api/auth/login` — Connexion
- `GET /api/auth/me` — Profil connecté

### Events (Public)
- `GET /api/events` — Liste des événements publiés (filtres: category, city, search)
- `GET /api/events/:id` — Détail d'un événement

### Orders
- `POST /api/orders` — Créer une commande (public/guest)
- `POST /api/orders/:id/payment-proof` — Upload reçu
- `GET /api/orders/track/:orderNumber` — Suivi commande
- `PATCH /api/orders/:id/confirm` — Valider commande (ORGANIZER)

### Tickets
- `POST /api/tickets/scan` — Scanner un QR (AGENT)
- `GET /api/tickets/agent/events` — Événements de l'agent
- `GET /api/tickets/event/:eventId/stats` — Stats de scan

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | React 18 + Vite + TailwindCSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| QR Scanner | jsQR (Web Camera API) |
| QR Generator | qrcode (Node.js) |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de données | PostgreSQL |
| Auth | JWT (jsonwebtoken) |
| Upload | Multer |
| Passwords | bcryptjs |

---

## 🎨 Design

- Thème sombre inspiré du désert mauritanien (couleurs sahara dorées)
- Responsive mobile-first
- Interface scanner optimisée pour smartphone

---

## 📁 Variables d'environnement (.env)

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mauti_ticket"
JWT_SECRET="votre_secret_jwt_super_securise"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```
