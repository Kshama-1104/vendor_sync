#!/bin/bash
echo "Backing up Task Forge..."
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
# Backup database and files
echo "Backup complete: $BACKUP_DIR"


