# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Declara as variáveis para o Vite embuti-las no bundle
ARG VITE_N8N_SAVE_CRM_URL
ARG VITE_WEBHOOK_SECRET
ENV VITE_N8N_SAVE_CRM_URL=$VITE_N8N_SAVE_CRM_URL
ENV VITE_WEBHOOK_SECRET=$VITE_WEBHOOK_SECRET

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]