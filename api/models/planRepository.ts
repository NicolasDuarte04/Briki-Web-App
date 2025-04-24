import pool from '../config/db';
import { QUERIES } from './queries';
import { InsurancePlan, PlanFilterCriteria } from './types';

export const PlanRepository = {
  // Initialize the database tables
  async initializeDb(): Promise<void> {
    try {
      await pool.query(QUERIES.CREATE_PLANS_TABLE);
      await pool.query(QUERIES.CREATE_INTERACTIONS_TABLE);
      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing database tables:', error);
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