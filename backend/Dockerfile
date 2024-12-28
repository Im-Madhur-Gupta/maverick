# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install required dependencies for Prisma
RUN apk add --no-cache openssl netcat-openbsd

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# TODO: We should generate the prisma client instead of copying it
COPY prisma ./prisma/

# Install the application dependencies
RUN yarn
RUN yarn global add prisma

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Create start script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

# Command to run the application
CMD ["node", "dist/src/main"]
