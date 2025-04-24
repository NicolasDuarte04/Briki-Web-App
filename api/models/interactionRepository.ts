import pool from '../config/db';
import { QUERIES } from './queries';
import { PlanInteraction, InteractionType } from './types';

export const InteractionRepository = {
  // Record a new interaction
  async createInteraction(
    planId: number,
    deviceId: string,
    interactionType: InteractionType,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<PlanInteraction> {
    try {
      const result = await pool.query(QUERIES.CREATE_INTERACTION, [
        planId,
        userId || null,
        deviceId,
        interactionType,
        metadata ? JSON.stringify(metadata) : null,
      ]);
      
      return this.mapInteractionFromDB(result.rows[0]);
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  },

  // Get interactions for a specific plan
  async getInteractionsByPlan(planId: number): Promise<PlanInteraction[]> {
    try {
      const result = await pool.query(QUERIES.GET_INTERACTIONS_BY_PLAN, [planId]);
      return result.rows.map(this.mapInteractionFromDB);
    } catch (error) {
      console.error(`Error fetching interactions for plan ${planId}:`, error);
      throw error;
    }
  },

  // Get interactions for a specific user or device
  async getInteractionsByUser(userId?: string, deviceId?: string): Promise<PlanInteraction[]> {
    try {
      const result = await pool.query(QUERIES.GET_INTERACTIONS_BY_USER, [
        userId || null,
        deviceId || null,
      ]);
      return result.rows.map(this.mapInteractionFromDB);
    } catch (error) {
      console.error(`Error fetching interactions for user/device:`, error);
      throw error;
    }
  },

  // Helper function to map DB fields to camelCase
  mapInteractionFromDB(dbInteraction: any): PlanInteraction {
    return {
      id: dbInteraction.id,
      planId: dbInteraction.plan_id,
      userId: dbInteraction.user_id,
      deviceId: dbInteraction.device_id,
      interactionType: dbInteraction.interaction_type as InteractionType,
      timestamp: dbInteraction.timestamp,
      metadata: dbInteraction.metadata,
    };
  },
};