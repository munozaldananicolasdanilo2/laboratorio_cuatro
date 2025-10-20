FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código de la aplicación
COPY . .

# Instalar sequelize-cli
RUN npm install -g sequelize-cli

# Exponer puerto
EXPOSE 3030

# Comando que ejecuta migraciones y luego inicia la app
CMD ["sh", "-c", "npx sequelize db:migrate && node src/index.js"]