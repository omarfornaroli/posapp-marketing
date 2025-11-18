# Usa una imagen de Node.js ligera para producción
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Instala 'dumb-init' para gestionar señales correctamente. Es una buena práctica en contenedores.
RUN apk add --no-cache dumb-init

# Copia los archivos de definición de paquetes
COPY package*.json ./

# Instala ÚNICAMENTE las dependencias de producción
RUN npm install --omit=dev --legacy-peer-deps

# Copia la aplicación Next.js ya compilada
# REQUISITO: Debes haber ejecutado 'npm run build' en tu máquina local antes de construir esta imagen.
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Establece variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Inicia la aplicación usando 'dumb-init' para gestionar el proceso de Node
# y el comando 'npm start' que ejecuta 'next start'
CMD ["dumb-init", "npm", "start"]
