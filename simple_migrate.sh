#!/bin/bash

# Database connection details
NEON_HOST="ep-small-night-a4dtn63i.us-east-1.aws.neon.tech"
NEON_DB="neondb"
NEON_USER="neondb_owner"
NEON_PASS="npg_J5LhiDNe2KGo"

RENDER_URL="postgresql://briki_db_user:vx5mSbC45IqheuZiqYJXotej61mRqozL@dpg-d1ialtripnbc73bdsc4g-a.oregon-postgres.render.com/briki_db"

echo "🚀 Database Migration: Neon → Render"
echo "===================================="

# Step 1: Export complete database as SQL INSERT statements
echo -e "\n📤 Exporting database from Neon..."
PGPASSWORD=$NEON_PASS psql -h $NEON_HOST -U $NEON_USER -d $NEON_DB -c "
-- Export all tables as INSERT statements
\\t
\\o neon_dump.sql
SELECT 
    'DROP TABLE IF EXISTS ' || tablename || ' CASCADE;' || E'\\n' ||
    'CREATE TABLE ' || tablename || ' AS TABLE ' || tablename || ' WITH NO DATA;' || E'\\n'
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
\\o
\\t
"

# Get table data as COPY commands
echo -e "\n📊 Generating data export commands..."
TABLES=$(PGPASSWORD=$NEON_PASS psql -h $NEON_HOST -U $NEON_USER -d $NEON_DB -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;")

# Create a comprehensive dump file
echo "-- Briki Database Migration" > full_migration.sql
echo "-- Generated on $(date)" >> full_migration.sql
echo "" >> full_migration.sql

# Add schema creation
for table in $TABLES; do
    if [ ! -z "$table" ]; then
        echo -e "\nProcessing table: $table"
        
        # Get CREATE TABLE statement
        echo "DROP TABLE IF EXISTS $table CASCADE;" >> full_migration.sql
        
        # Export table structure
        PGPASSWORD=$NEON_PASS psql -h $NEON_HOST -U $NEON_USER -d $NEON_DB -c "\\d $table" | \
        awk '/Table|Column|Type|Modifiers/ {print}' >> table_structure.txt
        
        # Export table data as INSERT statements
        PGPASSWORD=$NEON_PASS psql -h $NEON_HOST -U $NEON_USER -d $NEON_DB -t -c \
        "SELECT 'INSERT INTO $table VALUES (' || 
         string_agg(
            CASE 
                WHEN t.v IS NULL THEN 'NULL'
                WHEN pg_typeof(t.v)::text IN ('text', 'character varying', 'uuid', 'timestamp with time zone', 'timestamp without time zone', 'date') 
                THEN '''' || replace(t.v::text, '''', '''''') || ''''
                ELSE t.v::text
            END, ', '
         ) || ');'
         FROM $table, 
         LATERAL (SELECT unnest(ARRAY[row_to_json($table)::jsonb->*]) AS v) t;" >> full_migration.sql 2>/dev/null || echo "-- No data in $table" >> full_migration.sql
    fi
done

# Step 2: Apply to Render database
echo -e "\n📥 Importing to Render database..."
psql "$RENDER_URL" < full_migration.sql

# Step 3: Verify
echo -e "\n✅ Verification:"
for table in $TABLES; do
    if [ ! -z "$table" ]; then
        NEON_COUNT=$(PGPASSWORD=$NEON_PASS psql -h $NEON_HOST -U $NEON_USER -d $NEON_DB -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ')
        RENDER_COUNT=$(psql "$RENDER_URL" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ')
        
        if [ "$NEON_COUNT" = "$RENDER_COUNT" ]; then
            echo "  ✓ $table: $NEON_COUNT rows"
        else
            echo "  ✗ $table: $NEON_COUNT → $RENDER_COUNT rows"
        fi
    fi
done

# Clean up
rm -f neon_dump.sql table_structure.txt

echo -e "\n🎉 Migration completed!" 