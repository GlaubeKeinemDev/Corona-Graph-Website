# Frontend Dockerfile
FROM node:18

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# Build durchführen
#RUN npm run build

# Einfacher Webserver für das statische Build
#RUN npm install -g serve

# Port freigeben
EXPOSE 5173

# Startbefehl
CMD ["npm", "run", "dev", "--", "--host"]
