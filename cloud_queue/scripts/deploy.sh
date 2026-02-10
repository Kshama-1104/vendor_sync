#!/bin/bash

echo "Deploying Cloud Queue..."

# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# Wait for services to be ready
sleep 10

# Run migrations
docker-compose exec app npm run db:migrate

echo "Deployment complete!"


