# (use default)
FROM node:14

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl

# (use default)
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to app directory
COPY package.json package-lock.json ./

# (?) Install app dependencies
RUN npm ci --only=production

# Copy Prisma schema and seed files to app directory
COPY prisma/ ./prisma/
COPY prisma/seed.ts ./prisma/seed.ts

# Generate Prisma client
RUN npx prisma generate

# Seed database
RUN npx prisma db seed --preview-feature

# Copy app source code to app directory
COPY . .

# Build app
RUN npm run build

# Expose port 8080 for app
EXPOSE 8080

# Start app
CMD ["npm", "start"]
