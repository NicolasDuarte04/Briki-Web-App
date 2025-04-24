import { Request, Response } from 'express';
import { PlanRepository } from '../models/planRepository';
import { PlanFilterCriteria, ApiResponse, InsurancePlan } from '../models/types';

export const PlanController = {
  // Get all plans
  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await PlanRepository.getAllPlans();
      const response: ApiResponse<InsurancePlan[]> = {
        success: true,
        data: plans,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAllPlans controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch insurance plans',
      };
      res.status(500).json(response);
    }
  },

  // Get a specific plan by ID
  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid plan ID',
        };
        res.status(400).json(response);
        return;
      }

      const plan = await PlanRepository.getPlanById(planId);
      if (!plan) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Plan not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<InsurancePlan> = {
        success: true,
        data: plan,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in getPlanById controller:`, error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch insurance plan',
      };
      res.status(500).json(response);
    }
  },

  // Filter plans based on search criteria
  async filterPlans(req: Request, res: Response): Promise<void> {
    try {
      const criteria: PlanFilterCriteria = {
        origin: req.query.origin as string,
        destination: req.query.destination as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        age: req.query.age ? parseInt(req.query.age as string) : undefined,
        travelersCount: req.query.travelersCount ? parseInt(req.query.travelersCount as string) : undefined,
        minMedicalCoverage: req.query.minMedicalCoverage ? parseInt(req.query.minMedicalCoverage as string) : undefined,
        includeAdventureActivities: req.query.includeAdventureActivities === 'true',
      };

      const plans = await PlanRepository.filterPlans(criteria);
      const response: ApiResponse<InsurancePlan[]> = {
        success: true,
        data: plans,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in filterPlans controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to filter insurance plans',
      };
      res.status(500).json(response);
    }
  },

  // Get popular plans
  async getPopularPlans(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const plans = await PlanRepository.getPopularPlans(limit);
      const response: ApiResponse<InsurancePlan[]> = {
        success: true,
        data: plans,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getPopularPlans controller:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch popular insurance plans',
      };
      res.status(500).json(response);
    }
  },
};