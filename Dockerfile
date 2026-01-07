# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install Quasar CLI globally
RUN yarn global add @quasar/cli

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN yarn install

# Build the application
RUN yarn build

# Use a lightweight web server to serve the built application
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=0 /app/dist/spa /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]