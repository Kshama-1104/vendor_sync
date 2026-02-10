#!/bin/bash
echo "Deploying Task Forge..."
npm run build
docker-compose build
docker-compose up -d
echo "Deployment complete!"


