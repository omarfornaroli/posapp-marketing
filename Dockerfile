#
# Etapa 1: BUILDER - Compila la aplicación Next.js
#
FROM node:18-alpine AS builder

# Establece el directorio de trabajo para la compilación
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala solo las dependencias necesarias para la compilación
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Ejecuta el script de compilación para producción
RUN npm run build

#
# Etapa 2: RUNNER - Crea la imagen final de producción
#
FROM node:18-alpine AS runner

# Establece el directorio de trabajo para la ejecución
WORKDIR /app

# Copia las dependencias de producción desde la etapa 'builder'
# Esto evita tener que copiar todo node_modules y solo trae lo necesario
COPY --from=builder /app/node_modules ./node_modules
# Copia la carpeta .next que contiene la aplicación compilada
COPY --from=builder /app/.next ./.next
# Copia el package.json para que Next.js pueda funcionar correctamente
COPY --from=builder /app/package.json ./package.json
# Copia la carpeta 'public' si existe
COPY --from=builder /app/public ./public
# Copia la configuración de Next.js
COPY --from=builder /app/next.config.ts ./next.config.ts


# Expone el puerto 3000, que es el puerto por defecto de 'next start'
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción
# Utiliza 'next start' en lugar de 'npm run start' para mayor eficiencia
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
