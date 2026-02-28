# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy bot code
COPY . .

# Create data directory for SQLite
RUN mkdir -p data

# Run as non-root user
USER node

# Start the bot
CMD ["node", "src/index.js"]