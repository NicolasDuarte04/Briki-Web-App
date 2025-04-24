import { Request, Response } from 'express';
import { InteractionRepository } from '../models/interactionRepository';
import { ApiResponse, InteractionType, PlanInteraction } from '../models/types';

export const InteractionController = {
  // Record a new interaction
  async recordInteraction(req: Request, res: Response): Promise<void> {
    try {
      const { planId, deviceId, interactionType, userId, metadata } = req.body;

      // Validate required fields
      if (!planId || !deviceId || !interactionType) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields: planId, deviceId, and interactionType are required',
        };
        res.status(400).json(response);
        return;
      }

      // Validate interaction type
      if (!Object.values(InteractionType).includes(interactionType as InteractionType)) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Invalid interactionType. Must be one of: ${Object.values(InteractionType).join(', ')}`,
        };
        res.status(400).json(response);
        return;
      }

      const interaction = await InteractionRepository.createInteraction(
        planId,
        deviceId,
        interactionType as InteractionType,
        userId,
        metadata
      );

      const response: ApiResponse<PlanInteraction> = {
        success: true,
        data: interaction,
        message: 'Interaction recorded successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error in recordInteraction controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to record interaction',
      };
      res.status(500).json(response);
    }
  },

  // Get interactions for a plan
  async getPlanInteractions(req: Request, res: Response): Promise<void> {
    try {
      const planId = parseInt(req.params.planId);
      if (isNaN(planId)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid plan ID',
        };
        res.status(400).json(response);
        return;
      }

      const interactions = await InteractionRepository.getInteractionsByPlan(planId);
      const response: ApiResponse<PlanInteraction[]> = {
        success: true,
        data: interactions,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in getPlanInteractions controller:`, error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch plan interactions',
      };
      res.status(500).json(response);
    }
  },

  // Get interactions for a user or device
  async getUserInteractions(req: Request, res: Response): Promise<void> {
    try {
      const { userId, deviceId } = req.query;
      
      if (!userId && !deviceId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'At least one of userId or deviceId must be provided',
        };
        res.status(400).json(response);
        return;
      }

      const interactions = await InteractionRepository.getInteractionsByUser(
        userId as string,
        deviceId as string
      );
      
      const response: ApiResponse<PlanInteraction[]> = {
        success: true,
        data: interactions,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in getUserInteractions controller:`, error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch user interactions',
      };
      res.status(500).json(response);
    }
  },
};