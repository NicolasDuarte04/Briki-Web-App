#!/bin/bash

echo "=== Archiving Mock Data Files ==="
echo ""

# Create archive directory
ARCHIVE_DIR="server/data/_archived_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$ARCHIVE_DIR"

# Move all category directories to archive
for category in travel auto pet health home; do
  if [ -d "server/data/$category" ]; then
    echo "Archiving server/data/$category..."
    mv "server/data/$category" "$ARCHIVE_DIR/"
  fi
done

echo ""
echo "✅ Mock data files have been archived to: $ARCHIVE_DIR"
echo ""
echo "The AI assistant will now exclusively use the PostgreSQL database."
echo "To add plans, use the database seed scripts or direct database insertion."
echo ""
echo "Note: You may need to restart the server for changes to take effect." 