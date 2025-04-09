# Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose app port
EXPOSE 3000

# Default command: run in dev mode with auto-reload
CMD ["npm", "run", "dev"]
