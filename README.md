# CNP-Connect, backend du projet

## 📌 Présentation du projet

CNP-Connect est une application web interne destinée aux entreprises de transport en commun.  
Ce dépôt contient le **backend** de l’application, développé avec **NestJS et TypeScript**, utilisant **Prisma** comme ORM pour la base de données relationnelle.

---

## 🔁 Origine du dépôt & DevOps

Ce dépôt est un **miroir du dépôt GitLab d’origine** du projet CNP-Connect. Il reflète donc l’état du code développé initialement sur GitLab.

### 🐳 Conteneurisation

Des **Dockerfiles** sont présents pour conteneuriser le backend et permettre une exécution reproductible en environnement local et de production.

### 🔃 CI/CD (GitLab)

Le projet intègre une **pipeline GitLab CI/CD (`.gitlab-ci.yml`)** permettant :
- le build automatique de l’application,
- la construction de l’image Docker,
- le test automatique de l'image générée,
- et le push dans le **container registry GitLab**.

---

## 🏗️ Architecture Backend

Le backend suit une **architecture modulaire NestJS**, organisée par domaine métier.

Chaque module contient généralement :
- **Controller** → expose les endpoints HTTP
- **Service** → contient la logique métier
- **Repository / Prisma** → accès aux données
- **DTO** → validation et typage des données entrantes

Modules principaux :
- **Auth** → authentification, gestion des tokens, guards  
- **Users** → gestion des utilisateurs et rôles  
- **Alerts** → gestion des alertes  
- **Assignments** → gestion des affectations  

---

## 🛠️ Stack technique

| Outil | Usage |
|------|-------|
| **NestJS** | Framework backend |
| **TypeScript** | Typage statique |
| **Prisma** | ORM |
| **MySQL** | Base de données relationnelle |
| **JWT** | Authentification |
| **class-validator** | Validation des DTO |
| **Docker** | Conteneurisation |

---

## 🔐 Sécurité côté Backend

### Variables d’environnement

Les variables sensibles sont stockées dans un fichier `.env` (exclu du versioning).  


### CORS

Le backend configure les CORS afin de limiter les origines autorisées à appeler l’API depuis un navigateur.

### Gestion des erreurs

- Utilisation d’exceptions HTTP personnalisées.
- Filtre global pour les erreurs Prisma afin d’améliorer le débogage.
- Messages détaillés en développement, masqués en production.

---

## 🔑 Authentification (JWT)

L’authentification repose sur des JSON Web Token (JWT).

### Access Token

- Durée de vie courte
- Vérifié à chaque requête via un Auth Guard
- Contient uniquement l’identifiant (principe minimum claims)

### Refresh Token

- Stocké côté client dans un cookie httpOnly
- Stocké en base de données et associé à session pour permettre le multiplatforme
- Permet de générer un nouveau couple de tokens sans reconnecter l’utilisateur

### TokenService

Un service dédié gère :
- la création des tokens,
- leur validation,
- leur extraction depuis headers / cookies.

---

## 🌐 Endpoints API (principe général)

L’API suit des conventions REST :

- `POST /auth/login` → authentification
- `GET /users` → liste des utilisateurs
- `GET /users/:id` → détail utilisateur
- `POST /alerts` → création d’alerte
- `PATCH /assignments` → réaffectation


## 📁 Structure du projet (simplifiée)
```
src/
│── app.module.ts
│
│── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── token.service.ts
│
│── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.repository.ts
│   └── dto/
│
│── alert/
│   ├── alert.controller.ts
│   ├── alert.service.ts
│
│── utils/
│   ├── exceptions/
│   └── filters/
│
│── main.ts
```

---

## ⚙️ Configuration

Assure-toi d’avoir :

- Node.js installé
- MySQL en local ou via Docker

Un fichier **`.env.example`** est fourni comme modèle de configuration.

Pour l’utiliser :

```bash
cp .env.example .env
```

Puis renseigner les valeurs adaptées à ton environnement.

---

## 🚀 Lancer le projet en local

Installer les dépendances :
```bash
npm install
```

Générer Prisma :
```bash
npx prisma generate
```

Lancer le backend :
```bash
npm run start:dev
```

Par défaut : http://localhost:3000

---

## 🧪 Tests (Jest)

Le projet inclut des tests automatisés avec **Jest** (tests unitaires).

Commandes :

```bash
npm run test
npm run test:watch
```

---

## 📬 Contact

Si vous avez des questions, des suggestions ou souhaitez échanger sur le projet, vous pouvez me contacter :

Email : contact@peterfrancois.dev

LinkedIn : https://www.linkedin.com/in/peterfrancois/

GitHub : https://github.com/peter-francois/

N’hésitez pas à ouvrir une issue ou une pull request si vous souhaitez contribuer au projet.
