# Use Node.js LTS version as the base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Install OpenSSL and other required dependencies
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set default environment variables
ENV PORT=5000
ENV NODE_ENV=development

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["nodemon", "index.js"] 