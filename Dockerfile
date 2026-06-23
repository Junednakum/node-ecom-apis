# Use standard stable Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency configuration
COPY package*.json ./
COPY src/prisma ./src/prisma/

# Install dependencies
RUN npm ci

# Copy project source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Expose server port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
