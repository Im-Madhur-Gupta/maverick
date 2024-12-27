###################
# PRODUCTION BUILD
###################

# Create a production image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN yarn --production

# Build the application
RUN yarn build

# Copy the built application from the previous stage
COPY /app/dist ./dist

# Command to run the app
CMD ["node", "dist/main"]