FROM node:20-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json primero para aprovechar la cache
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos la app de Next.js
RUN npm run build

# Exponemos el puerto de la app
EXPOSE 3000

# Comando por defecto
RUN npm run start
