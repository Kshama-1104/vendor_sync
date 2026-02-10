#!/bin/bash
echo "Setting up Task Forge..."
mkdir -p logs uploads attachments backups
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please update .env with your configuration"
fi
echo "Setup complete!"


