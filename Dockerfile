# Use Node.js LTS image
FROM node:22

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port 8080 (as set in .env and used in app.js)
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
