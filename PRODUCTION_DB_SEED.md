# Production Database Seeding Guide

## Quick Start

### Step 1: Check Database Status

```bash
# Use the debug endpoint to check current plan count
curl https://briki-backend.onrender.com/api/debug/plans-count

# Check by category
curl https://briki-backend.onrender.com/api/debug/plans-count?category=auto
```

### Step 2: Seed the Database

1. **SSH into your Render instance** or run locally with production DB connection:

```bash
# Set production database URL
export DATABASE_URL="postgresql://your-production-db-url"

# Run the seeding script
npm run seed:production

# Or with force flag to clear existing data
npm run seed:production -- --force
```

2. **Alternatively, use the script directly:**

```bash
# From the project root
cd Briki-Web-App
npx tsx scripts/seed-production.ts
```

### Step 3: Verify Seeding

After seeding, verify the data:

```bash
# Check overall count
curl https://briki-backend.onrender.com/api/debug/plans-count

# Expected output:
{
  "total": 164,
  "category": "all",
  "categoryBreakdown": {
    "auto": 36,
    "health": 45,
    "travel": 52,
    "pet": 17,
    "life": 14
  },
  "samplePlans": [...],
  "timestamp": "2024-01-20T..."
}
```

## Database Connection

The production database is hosted on Render's PostgreSQL instance. Connection details:

- **Host**: Retrieved from Render dashboard
- **Database**: briki_production
- **SSL**: Required for production

## Data Source

Plans are loaded from `/server/data/real-insurance-plans.json` which contains 164 real insurance plans from Colombian providers including:

- SURA
- MAPFRE
- Seguros Bolívar
- HDI Seguros
- Pax Assistance
- Terrawind Global Protection
- And more...

## Troubleshooting

### Issue: Empty suggestedPlans in AI responses

**Cause**: The OpenAI service queries the `insurance_plans` table which may be empty.

**Solution**: 
1. Run the seeding script above
2. Verify with the debug endpoint
3. Check logs: `SELECT COUNT(*) FROM insurance_plans;`

### Issue: "No plans found in database" in logs

**Cause**: The database hasn't been seeded yet.

**Solution**: Follow the seeding steps above.

### Issue: Connection errors during seeding

**Cause**: Database URL not set or SSL issues.

**Solution**:
1. Ensure `DATABASE_URL` is set correctly
2. Add `?ssl=true` to the connection string
3. Check Render logs for detailed errors

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "seed:production": "tsx scripts/seed-production.ts",
    "db:check": "tsx scripts/check-db-status.ts"
  }
}
```

## Security Notes

- Never commit database credentials
- Use environment variables for all sensitive data
- The seeding script has safety checks to prevent accidental data loss
- Use `--force` flag carefully in production 