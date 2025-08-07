FROM node:18-alpine

WORKDIR /app

# Install deps first (for caching)
COPY package*.json ./
RUN npm ci

# Copy Prisma files **first**
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Then copy the rest of your code
COPY . .

# Build app
RUN npm run build

EXPOSE 3000

# Run migrations when container starts
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
