FROM node:20-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Exponemos el puerto de la app
EXPOSE 3000

# Copiamos package.json y package-lock.json primero para aprovechar la cache
COPY package*.json ./

# Copiamos el resto del proyecto
COPY . .

# Instalamos dependencias
CMD ["sh", "-c", "npm install && npm run build && npm run start"]
