import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { z } from 'zod';
import {
  InsuranceCategory,
  INSURANCE_CATEGORIES,
  CompanyPlan,
  InsertCompanyPlan
} from '@shared/schema';

// Base validation schema for plan uploads
const basePlanSchema = z.object({
  name: z.string().min(2, "Plan name is required and must be at least 2 characters"),
  category: z.enum([
    INSURANCE_CATEGORIES.TRAVEL,
    INSURANCE_CATEGORIES.AUTO,
    INSURANCE_CATEGORIES.PET,
    INSURANCE_CATEGORIES.HEALTH
  ], { 
    errorMap: () => ({ message: "Category must be one of: travel, auto, pet, health" })
  }),
  basePrice: z.coerce.number().min(1, "Base price must be a positive number"),
  coverageAmount: z.coerce.number().min(1, "Coverage amount must be a positive number"),
  planId: z.string().optional(),
  provider: z.string().optional(),
  description: z.string().optional(),
  features: z.string().transform(str => 
    str.split(',').map(s => s.trim()).filter(Boolean)
  ).optional(),
  rating: z.string().optional(),
  badge: z.string().optional(),
});

// Type for validation results
interface ValidationResult {
  valid: boolean;
  errors?: string[];
  data?: any;
}

// Type for the entire batch validation
interface BatchValidationResult {
  success: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: Record<number, string[]>; // Row number to errors
  validPlans: any[];
}

/**
 * Parse a CSV file and validate plan data
 */
export async function parseCSVFile(filePath: string, companyId: number): Promise<BatchValidationResult> {
  const results: BatchValidationResult = {
    success: false,
    totalRecords: 0,
    validRecords: 0,
    invalidRecords: 0,
    errors: {},
    validPlans: []
  };

  const records: any[] = [];

  try {
    // Read the CSV file
    await pipeline(
      fs.createReadStream(filePath),
      csv(),
      async function* (source) {
        let rowIndex = 0;
        for await (const record of source) {
          rowIndex++;
          records.push({ ...record, _rowIndex: rowIndex });
          yield record;
        }
      }
    );

    // Process records
    results.totalRecords = records.length;
    
    if (records.length === 0) {
      results.errors[-1] = ["The file contains no records"];
      return results;
    }

    // Validate each record
    for (const record of records) {
      const rowIndex = record._rowIndex;
      delete record._rowIndex;
      
      const validationResult = validatePlanRecord(record);
      
      if (validationResult.valid && validationResult.data) {
        // Add company ID to the record
        const planData = {
          ...validationResult.data,
          companyId,
          planId: validationResult.data.planId || `PLAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          // Set category-specific fields based on the category
          categoryFields: extractCategoryFields(validationResult.data, validationResult.data.category)
        };
        
        results.validRecords++;
        results.validPlans.push(planData);
      } else if (validationResult.errors) {
        results.invalidRecords++;
        results.errors[rowIndex] = validationResult.errors;
      }
    }

    results.success = results.invalidRecords === 0 && results.validRecords > 0;
    return results;
  } catch (error: any) {
    console.error('Error parsing CSV file:', error);
    results.errors[-1] = [`Failed to parse file: ${error.message}`];
    return results;
  }
}

/**
 * Parse an XLSX file and validate plan data
 */
export async function parseXLSXFile(filePath: string, companyId: number): Promise<BatchValidationResult> {
  const results: BatchValidationResult = {
    success: false,
    totalRecords: 0,
    validRecords: 0,
    invalidRecords: 0,
    errors: {},
    validPlans: []
  };

  try {
    // Read the XLSX file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = xlsx.utils.sheet_to_json(worksheet);

    // Process records
    results.totalRecords = records.length;
    
    if (records.length === 0) {
      results.errors[-1] = ["The file contains no records"];
      return results;
    }

    // Validate each record
    records.forEach((record: any, index: number) => {
      const rowIndex = index + 2; // +2 because Excel starts at 1 and there's a header row
      
      const validationResult = validatePlanRecord(record);
      
      if (validationResult.valid && validationResult.data) {
        // Add company ID to the record
        const planData = {
          ...validationResult.data,
          companyId,
          planId: validationResult.data.planId || `PLAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          // Set category-specific fields based on the category
          categoryFields: extractCategoryFields(validationResult.data, validationResult.data.category)
        };
        
        results.validRecords++;
        results.validPlans.push(planData);
      } else if (validationResult.errors) {
        results.invalidRecords++;
        results.errors[rowIndex] = validationResult.errors;
      }
    });

    results.success = results.invalidRecords === 0 && results.validRecords > 0;
    return results;
  } catch (error: any) {
    console.error('Error parsing XLSX file:', error);
    results.errors[-1] = [`Failed to parse file: ${error.message}`];
    return results;
  }
}

/**
 * Validate a single plan record against the schema
 */
function validatePlanRecord(record: any): ValidationResult {
  try {
    // Run basic validation
    const parseResult = basePlanSchema.safeParse(record);
    
    if (!parseResult.success) {
      return {
        valid: false,
        errors: parseResult.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        )
      };
    }
    
    // Add additional category-specific validation here if needed
    return {
      valid: true,
      data: parseResult.data
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`Unexpected error: ${error.message}`]
    };
  }
}

/**
 * Extract category-specific fields based on the plan category
 */
function extractCategoryFields(record: any, category: InsuranceCategory): any {
  switch (category) {
    case INSURANCE_CATEGORIES.TRAVEL:
      return {
        destinations: record.destinations ? record.destinations.split(',').map(s => s.trim()) : [],
        coversMedical: record.coversMedical === 'true' || record.coversMedical === true,
        coversCancellation: record.coversCancellation === 'true' || record.coversCancellation === true,
        coversValuables: record.coversValuables === 'true' || record.coversValuables === true,
        maxTripDuration: parseInt(record.maxTripDuration || '30', 10),
      };
    
    case INSURANCE_CATEGORIES.AUTO:
      return {
        vehicleTypes: record.vehicleTypes ? record.vehicleTypes.split(',').map(s => s.trim()) : [],
        comprehensive: record.comprehensive === 'true' || record.comprehensive === true,
        roadside: record.roadside === 'true' || record.roadside === true,
      };
    
    case INSURANCE_CATEGORIES.PET:
      return {
        petTypes: record.petTypes ? record.petTypes.split(',').map(s => s.trim()) : [],
        coversIllness: record.coversIllness === 'true' || record.coversIllness === true,
        coversAccident: record.coversAccident === 'true' || record.coversAccident === true,
      };
    
    case INSURANCE_CATEGORIES.HEALTH:
      return {
        coversPreventive: record.coversPreventive === 'true' || record.coversPreventive === true,
        coversEmergency: record.coversEmergency === 'true' || record.coversEmergency === true,
        coversSpecialist: record.coversSpecialist === 'true' || record.coversSpecialist === true,
      };
    
    default:
      return {};
  }
}