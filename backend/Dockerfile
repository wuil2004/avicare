FROM node:20-alpine

WORKDIR /app

# Instalamos nodemon globalmente en el sistema del contenedor
RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]