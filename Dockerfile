# Imagen base de Node LTS
FROM node:20-alpine

# Instalamos las dependencias necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias(optimiza cahce)
COPY package*.json ./

# Instalar dependencias
RUN npm install --ignore-scripts

# Copiar resto de los archivos
COPY . .

# Prisma
RUN npx prisma generate

# exponemos el puerto de la API
EXPOSE 3000

# Comando para iniciar la app + seed
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]