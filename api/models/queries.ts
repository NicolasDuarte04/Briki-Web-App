export const QUERIES = {
  // Insurance Plans
  GET_ALL_PLANS: `
    SELECT * FROM insurance_plans 
    ORDER BY name ASC
  `,
  
  GET_PLAN_BY_ID: `
    SELECT * FROM insurance_plans 
    WHERE id = $1
  `,
  
  FILTER_PLANS: `
    SELECT * FROM insurance_plans
    WHERE ($1::text IS NULL OR country = $1 OR country = 'all')
    AND ($2::boolean IS NULL OR adventure_activities = $2)
    AND ($3::int IS NULL OR medical_coverage >= $3)
    ORDER BY base_price ASC
  `,
  
  // Plan Interactions
  CREATE_INTERACTION: `
    INSERT INTO plan_interactions
    (plan_id, user_id, device_id, interaction_type, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
  
  GET_INTERACTIONS_BY_PLAN: `
    SELECT * FROM plan_interactions
    WHERE plan_id = $1
    ORDER BY timestamp DESC
  `,
  
  GET_INTERACTIONS_BY_USER: `
    SELECT * FROM plan_interactions
    WHERE user_id = $1 OR device_id = $2
    ORDER BY timestamp DESC
  `,
  
  GET_POPULAR_PLANS: `
    SELECT p.*, COUNT(i.id) as interaction_count
    FROM insurance_plans p
    JOIN plan_interactions i ON p.id = i.plan_id
    GROUP BY p.id
    ORDER BY interaction_count DESC
    LIMIT $1
  `,

  // Database Schema Setup
  CREATE_PLANS_TABLE: `
    CREATE TABLE IF NOT EXISTS insurance_plans (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      medical_coverage INTEGER NOT NULL,
      trip_cancellation TEXT NOT NULL,
      baggage_protection INTEGER NOT NULL,
      emergency_evacuation INTEGER,
      adventure_activities BOOLEAN DEFAULT FALSE,
      rental_car_coverage INTEGER,
      rating TEXT,
      reviews INTEGER DEFAULT 0,
      country TEXT DEFAULT 'all',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

  CREATE_INTERACTIONS_TABLE: `
    CREATE TABLE IF NOT EXISTS plan_interactions (
      id SERIAL PRIMARY KEY,
      plan_id INTEGER NOT NULL REFERENCES insurance_plans(id),
      user_id TEXT,
      device_id TEXT NOT NULL,
      interaction_type TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB
    )
  `,
};