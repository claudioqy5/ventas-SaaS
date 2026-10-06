# Step 1: Build the Next.js application
FROM node:20-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pasar las variables de entorno en tiempo de construcción
ARG VITE_API_URL
ARG VITE_EMPRESA_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_EMPRESA_ID=$VITE_EMPRESA_ID

RUN npm run build

# Step 2: Production environment
FROM node:20-alpine AS production-stage
WORKDIR /app

# Copiar archivos necesarios para ejecutar
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/node_modules ./node_modules

# Opcional: Copiar archivo env si se necesita en runtime, pero es mejor inyectarlo
# COPY .env .env

EXPOSE 3000
CMD ["npm", "start"]
