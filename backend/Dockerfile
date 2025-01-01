# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install required dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# TODO: We should generate the prisma client instead of copying it
COPY prisma ./prisma/

# Install the application dependencies
RUN yarn
RUN yarn global add prisma

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Copy and set the entrypoint script for DB migrations
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Command to run the application
CMD ["node", "dist/src/main"]
