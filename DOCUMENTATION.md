# Documentation Technique — Platform Engineering avec Backstage

## 1. Architecture de la plateforme

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKSTAGE                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Software     │  │  Catalog     │  │  GitHub Actions       │  │
│  │  Template     │──│  Register    │  │  (Workflow Trigger)   │  │
│  └──────┬───────┘  └──────────────┘  └───────────────────────┘  │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  GitHub Repo    │────▶│  GitHub Actions   │────▶│  Docker Hub  │
│  (Code source)  │     │  (CI/CD Pipeline) │     │  (Registry)  │
└─────────────────┘     └────────┬─────────┘     └──────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Self-Hosted     │
                        │  Runner (Local)  │
                        │  docker compose  │
                        │  → localhost:3000│
                        └──────────────────┘
```

## 2. Composants techniques

### 2.1 Software Template Backstage

**Fichier** : `templates/portfolio-nextjs-template/template.yaml`

| Propriété | Valeur |
|-----------|--------|
| API Version | `scaffolder.backstage.io/v1beta3` |
| Type | `website` |
| Owner | `user:guest` |

**Paramètres du formulaire :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `name` | string | Nom du projet (pattern: `^[a-z0-9-]+$`) |
| `owner_name` | string | Nom complet du développeur |
| `dockerhub_user` | string | Utilisateur Docker Hub |
| `dockerhub_token` | secret | Token d'authentification Docker Hub |
| `repoUrl` | RepoUrlPicker | URL du dépôt GitHub |

**Étapes d'exécution :**
| Étape | Action | Description |
|-------|--------|-------------|
| `fetch` | `fetch:template` | Génère le projet depuis le skeleton |
| `publish` | `publish:github` | Crée le dépôt GitHub + pousse les secrets |
| `register` | `catalog:register` | Enregistre le composant dans le catalogue |

### 2.2 Application Next.js

| Technologie | Version |
|------------|---------|
| Next.js | 16.4.6 |
| React | 19.3.0 |
| Tailwind CSS | 4.3.3 |
| Node.js (Docker) | 22-alpine |

**Configuration Next.js** (`next.config.ts`) :
```typescript
const nextConfig: NextConfig = {
  output: "standalone",  // Requis pour le Dockerfile multi-stage
};
```

### 2.3 Dockerfile (Multi-Stage Build)

| Stage | Base Image | Rôle |
|-------|-----------|------|
| `deps` | `node:22-alpine` | Installation des dépendances (`npm ci`) |
| `build` | `node:22-alpine` | Compilation Next.js (`npm run build`) |
| `run` | `node:22-alpine` | Exécution en production (standalone) |

**Optimisations :**
- Séparation deps/build pour le cache Docker
- Image finale légère (standalone = pas de `node_modules`)
- `HOSTNAME=0.0.0.0` pour écouter sur toutes les interfaces

### 2.4 Docker Compose

```yaml
services:
  portfolio:
    image: ${DOCKERHUB_USER}/portfolio-nextjs:${TAG:-v1}
    ports: ["3000:3000"]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000"]
      interval: 10s
```

**Variables d'environnement requises :**
- `DOCKERHUB_USER` : nom d'utilisateur Docker Hub
- `TAG` : version de l'image (défaut: `v1`)

### 2.5 Pipeline CI/CD (GitHub Actions)

**Fichier** : `.github/workflows/ci.yml`

**Déclencheurs :**
- `push` sur la branche `main` (automatique)
- `workflow_dispatch` (manuel, avec version optionnelle)

**Jobs :**

| Job | Runner | Dépendances | Actions |
|-----|--------|-------------|---------|
| `build-push` | `ubuntu-latest` | — | Checkout → Version → Docker Login → Build & Push |
| `deploy-local` | `self-hosted` | `build-push` | Checkout → Docker Compose Pull → Up → Health Check |

**Convention de versionnement :**
- Automatique : `v{github.run_number}` (v1, v2, v3...)
- Manuel : version saisie dans `workflow_dispatch`
- Tag `latest` toujours mis à jour

**Secrets GitHub requis :**
| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Token d'accès Docker Hub |

## 3. Configuration Backstage

### 3.1 Backend (`packages/backend/src/index.ts`)

Plugins activés :
- `plugin-scaffolder-backend` + `module-github` — Templates
- `plugin-catalog-backend` + `module-scaffolder-entity-model` — Catalogue
- `plugin-auth-backend` + `module-guest-provider` — Authentification
- `plugin-permission-backend` + `module-allow-all-policy` — Permissions
- `plugin-search-backend` — Recherche
- `plugin-notifications-backend` — Notifications

### 3.2 Configuration (`app-config.yaml` + `app-config.local.yaml`)

| Paramètre | Valeur |
|-----------|--------|
| App URL | `http://localhost:3001` |
| Backend URL | `http://localhost:7007` |
| Database | SQLite (fichier `backstage.db`) |
| GitHub Integration | Token via `$GITHUB_TOKEN` |
| Auth Provider | Guest (développement) |

### 3.3 Catalogue

Enregistrement du template :
```yaml
catalog:
  locations:
    - type: file
      target: ../../templates/portfolio-nextjs-template/template.yaml
```

## 4. Flux de travail complet

### 4.1 Création initiale (Steps 1-6)

```
Développeur → Backstage UI (Create)
    │
    ├─ 1. Remplit le formulaire (nom, owner, DockerHub, repo)
    ├─ 2. Backstage génère le projet (fetch:template)
    ├─ 3. Backstage crée le repo GitHub (publish:github)
    ├─ 4. Backstage enregistre dans le catalogue (catalog:register)
    │
    └─ GitHub Actions se déclenche automatiquement (push → main)
        ├─ 5. Build de l'image Docker
        ├─ 6. Push vers Docker Hub
        └─ 7. Déploiement local via docker compose (self-hosted runner)
```

### 4.2 Évolution (Step 7)

```
Développeur → Modifie le code (nouvelles fonctionnalités)
    │
    ├─ git add + commit + push
    │
    └─ GitHub Actions se re-déclenche automatiquement
        ├─ Reconstruit l'image (nouveau tag v2, v3...)
        ├─ Re-publie sur Docker Hub
        └─ Re-déploie localement
```

**Aucune commande Docker ou docker-compose n'est exécutée manuellement.**

## 5. Prérequis d'installation

| Outil | Version minimum | Usage |
|-------|----------------|-------|
| Node.js | 20+ | Backstage, Next.js |
| Yarn | 4.x | Package manager Backstage |
| Docker | 24+ | Conteneurisation |
| Git | 2.x | Versioning |
| GitHub Account | — | Hébergement du code |
| Docker Hub Account | — | Registry d'images |
| GitHub Actions Runner | 2.x | Déploiement local |

