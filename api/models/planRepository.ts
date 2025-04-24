import pool from '../config/db';
import { QUERIES } from './queries';
import { InsurancePlan, PlanFilterCriteria } from './types';
import { samplePlans } from './sampleData';

export const PlanRepository = {
  // Initialize the database tables
  async initializeDb(): Promise<void> {
    try {
      // Create tables if they don't exist
      await pool.query(QUERIES.CREATE_PLANS_TABLE);
      await pool.query(QUERIES.CREATE_INTERACTIONS_TABLE);
      console.log('Database tables initialized successfully');
      
      // Seed initial data if needed
      await this.seedInitialData();
    } catch (error) {
      console.error('Error initializing database tables:', error);
      throw error;
    }
  },
  
  // Seed initial insurance plan data
  async seedInitialData(): Promise<void> {
    try {
      // Check if we already have plans in the database
      const existingPlans = await pool.query('SELECT COUNT(*) FROM insurance_plans');
      
      if (parseInt(existingPlans.rows[0].count) > 0) {
        console.log('Plans already exist, skipping seed');
        return;
      }
      
      // Insert sample plans
      for (const plan of samplePlans) {
        await pool.query(`
          INSERT INTO insurance_plans (
            id, name, provider, base_price, medical_coverage, 
            trip_cancellation, baggage_protection, emergency_evacuation, 
            adventure_activities, rental_car_coverage, rating, reviews, country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          plan.id,
          plan.name,
          plan.provider,
          plan.basePrice,
          plan.medicalCoverage,
          plan.tripCancellation,
          plan.baggageProtection,
          plan.emergencyEvacuation,
          plan.adventureActivities,
          plan.rentalCarCoverage,
          plan.rating,
          plan.reviews,
          plan.country
        ]);
      }
      
      console.log(`Seeded ${samplePlans.length} insurance plans successfully`);
    } catch (error) {
      console.error('Error seeding initial data:', error);
      throw error;
    }
  },

  // Get all insurance plans
  async getAllPlans(): Promise<InsurancePlan[]> {
    try {
      const result = await pool.query(QUERIES.GET_ALL_PLANS);
      return result.rows.map(this.mapPlanFromDB);
    } catch (error) {
      console.error('Error fetching all plans:', error);
      throw error;
    }
  },

  // Get a plan by ID
  async getPlanById(id: number): Promise<InsurancePlan | null> {
    try {
      const result = await pool.query(QUERIES.GET_PLAN_BY_ID, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return this.mapPlanFromDB(result.rows[0]);
    } catch (error) {
      console.error(`Error fetching plan with ID ${id}:`, error);
      throw error;
    }
  },

  // Filter plans based on criteria
  async filterPlans(criteria: PlanFilterCriteria): Promise<InsurancePlan[]> {
    try {
      const result = await pool.query(QUERIES.FILTER_PLANS, [
        criteria.destination,
        criteria.includeAdventureActivities,
        criteria.minMedicalCoverage,
      ]);
      return result.rows.map(this.mapPlanFromDB);
    } catch (error) {
      console.error('Error filtering plans:', error);
      throw error;
    }
  },

  // Get popular plans based on interaction count
  async getPopularPlans(limit = 5): Promise<InsurancePlan[]> {
    try {
      const result = await pool.query(QUERIES.GET_POPULAR_PLANS, [limit]);
      return result.rows.map(this.mapPlanFromDB);
    } catch (error) {
      console.error('Error fetching popular plans:', error);
      throw error;
    }
  },

  // Helper function to map DB fields to camelCase
  mapPlanFromDB(dbPlan: any): InsurancePlan {
    return {
      id: dbPlan.id,
      name: dbPlan.name,
      provider: dbPlan.provider,
      basePrice: dbPlan.base_price,
      medicalCoverage: dbPlan.medical_coverage,
      tripCancellation: dbPlan.trip_cancellation,
      baggageProtection: dbPlan.baggage_protection,
      emergencyEvacuation: dbPlan.emergency_evacuation,
      adventureActivities: dbPlan.adventure_activities,
      rentalCarCoverage: dbPlan.rental_car_coverage,
      rating: dbPlan.rating,
      reviews: dbPlan.reviews,
      country: dbPlan.country,
      createdAt: dbPlan.created_at,
    };
  },
};