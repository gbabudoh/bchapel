#!/bin/bash

# Battersea Chapel Database Backup Script
# This script creates daily backups of the SQLite database
# Usage: Run manually or via cron job

# Configuration
DB_PATH="/var/www/bchapel3/database.sqlite"
BACKUP_DIR="/var/www/bchapel3/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/database_$DATE.sqlite"
LOG_FILE="/var/www/bchapel3/backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check if database file exists
if [ ! -f "$DB_PATH" ]; then
    log_message "ERROR: Database file not found at $DB_PATH"
    exit 1
fi

# Create backup
log_message "Starting database backup..."

if cp "$DB_PATH" "$BACKUP_FILE"; then
    log_message "SUCCESS: Database backed up to $BACKUP_FILE"
    
    # Compress the backup to save space
    if gzip "$BACKUP_FILE"; then
        log_message "SUCCESS: Backup compressed to ${BACKUP_FILE}.gz"
    else
        log_message "WARNING: Failed to compress backup file"
    fi
    
    # Set proper permissions
    chown www-data:www-data "${BACKUP_FILE}.gz" 2>/dev/null || true
    chmod 644 "${BACKUP_FILE}.gz" 2>/dev/null || true
    
else
    log_message "ERROR: Failed to create backup"
    exit 1
fi

# Clean up old backups (keep last 7 days)
log_message "Cleaning up old backups..."
find "$BACKUP_DIR" -name "database_*.sqlite.gz" -mtime +7 -delete 2>/dev/null

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "database_*.sqlite.gz" | wc -l)
log_message "Cleanup complete. $BACKUP_COUNT backup files remaining."

# Optional: Check backup integrity
if command -v sqlite3 >/dev/null 2>&1; then
    # Decompress temporarily to check integrity
    TEMP_FILE="/tmp/temp_backup_check.sqlite"
    if gunzip -c "${BACKUP_FILE}.gz" > "$TEMP_FILE" 2>/dev/null; then
        if sqlite3 "$TEMP_FILE" "PRAGMA integrity_check;" >/dev/null 2>&1; then
            log_message "SUCCESS: Backup integrity verified"
        else
            log_message "WARNING: Backup integrity check failed"
        fi
        rm -f "$TEMP_FILE"
    fi
fi

log_message "Backup process completed successfully"

# Optional: Send notification (uncomment if you want email notifications)
# echo "Database backup completed successfully at $(date)" | mail -s "Battersea Chapel DB Backup" admin@yourdomain.com

exit 0