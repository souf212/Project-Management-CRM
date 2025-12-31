# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# We need a custom nginx config for the frontend if we want to handle React Router history mode (try_files)
# For now, we'll strip the default config and stick to simple serving, 
# but usually we want a specific conf. We can inline a simple one or just use default.
# Let's use default but ensure 404s fallback to index.html for SPA
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
