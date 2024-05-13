FROM node:latest

# Install SQLite3
RUN apt-get update && apt-get install -y sqlite3

# Instal Typescript Globally
RUN npm install -g typescript

# Create app directory
WORKDIR /app