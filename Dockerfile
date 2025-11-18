# Etapa 1: Instalar dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# REQUISITO: Debes haber ejecutado 'npm run build' en tu máquina local antes de construir esta imagen.
COPY .next ./.next
COPY next.config.ts ./

# Expone el puerto que Next.js usará en producción
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción
CMD ["npm", "start"]
