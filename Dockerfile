FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create necessary directories
RUN mkdir -p data logs

# Non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bot -u 1001
RUN chown -R bot:nodejs /app/data /app/logs
USER bot

EXPOSE 3000

CMD ["npm", "start"]
