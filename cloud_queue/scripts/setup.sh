#!/bin/bash

echo "Setting up Cloud Queue..."

# Install dependencies
npm install

# Create necessary directories
mkdir -p logs queue-data messages dlq

# Set up environment
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file. Please update with your configuration."
fi

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

echo "Setup complete!"


