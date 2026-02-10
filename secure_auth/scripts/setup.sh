#!/bin/bash

echo "Setting up Secure Auth..."

npm install

mkdir -p logs sessions tokens keys mfa-secrets

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file. Please update with your configuration."
fi

npm run db:migrate
npm run db:seed

echo "Setup complete!"


