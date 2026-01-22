# 10.5 Deployment

Deploy your React applications to production.

---

## 🚀 Deployment Options

| Platform | Best For | Free Tier |
|----------|----------|-----------|
| **Vercel** | Next.js, React | ✅ Generous |
| **Netlify** | Static sites | ✅ Generous |
| **Cloudflare Pages** | Edge, fast | ✅ Generous |
| **Railway** | Full-stack | ⚠️ Limited |
| **Docker** | Custom hosting | Varies |

---

## 📦 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or connect GitHub repository for auto-deploy.

---

## 📦 Netlify Deployment

```bash
# Build command
npm run build

# Publish directory
dist/
```

Add `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐳 Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔄 CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install & Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📝 Summary

- Vercel/Netlify for simplicity
- Docker for custom infrastructure
- GitHub Actions for CI/CD
- Environment variables for secrets

---

[← Back to Module 10](../README.md)
