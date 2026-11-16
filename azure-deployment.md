# Azure Deployment Guide — askClarant.ai CMS

## Prerequisites

- Azure account with an active subscription
- Azure CLI installed (`az --version`)
- Node.js 20+ and npm installed locally

---

## Option A: Azure App Service (Recommended)

### 1. Create PostgreSQL database

```bash
# Create a resource group
az group create --name askClarant-rg --location eastus

# Create Azure Database for PostgreSQL (Flexible Server)
az postgres flexible-server create \
  --name askClarant-postgres \
  --resource-group askClarant-rg \
  --location eastus \
  --admin-user pgadmin \
  --admin-password "YourStrongPassword123!" \
  --sku-name Standard_D2s_v3 \
  --tier GeneralPurpose \
  --storage-size 32

# Create the application database
az postgres flexible-server db create \
  --name askClarant_cms \
  --resource-group askClarant-rg \
  --server-name askClarant-postgres
```

### 2. Create App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name askClarant-plan \
  --resource-group askClarant-rg \
  --sku B2 \
  --is-linux

# Create the Web App
az webapp create \
  --name askClarant-cms \
  --resource-group askClarant-rg \
  --plan askClarant-plan \
  --runtime "NODE:20-lts"
```

### 3. Configure environment variables

```bash
az webapp config appsettings set \
  --name askClarant-cms \
  --resource-group askClarant-rg \
  --settings \
    DATABASE_URL="postgresql://pgadmin:YourStrongPassword123!@askClarant-postgres.postgres.database.azure.com/askClarant_cms?sslmode=require" \
    AUTH_SECRET="$(openssl rand -base64 32)" \
    NEXTAUTH_URL="https://askClarant-cms.azurewebsites.net" \
    NODE_ENV="production"
```

### 4. Deploy

```bash
# Build the app
npm run build

# Deploy using ZIP deploy
zip -r deploy.zip . --exclude node_modules .next/cache

az webapp deployment source config-zip \
  --name askClarant-cms \
  --resource-group askClarant-rg \
  --src deploy.zip
```

### 5. Run migrations on first deploy

```bash
# SSH into the app service
az webapp ssh --name askClarant-cms --resource-group askClarant-rg

# Inside the container:
npx prisma migrate deploy
npx prisma db seed
```

---

## Option B: Azure Container Apps

### 1. Build and push Docker image

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Create Container Registry
az acr create --name askClarantacr --resource-group askClarant-rg --sku Basic

# Build and push
az acr build --registry askClarantacr --image askClarant:latest .
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random secret for JWT signing (min 32 chars) |
| `NEXTAUTH_URL` | ✅ | Full URL of your deployed app |
| `NODE_ENV` | ✅ | Set to `production` |

---

## Database Migrations (CI/CD)

Add this step to your GitHub Actions or Azure DevOps pipeline:

```yaml
- name: Run Prisma migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## First-time Setup Checklist

- [ ] PostgreSQL database created and connection string set
- [ ] `AUTH_SECRET` generated and set
- [ ] `NEXTAUTH_URL` set to your app's URL
- [ ] `npx prisma migrate deploy` ran successfully
- [ ] `npx prisma db seed` ran to create initial admin user
- [ ] Login at `/login` with `admin@askClarant.ai` / `Admin@1234`
- [ ] **Change the admin password immediately in Settings**
