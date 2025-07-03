import { createClient } from '@supabase/supabase-js';
import { log } from '../vite';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface DocumentSummary {
  id?: string;
  user_id?: string | null;
  filename: string;
  insurance_type: 'auto' | 'health' | 'travel' | 'pet' | 'other';
  insurer_name?: string;
  coverage_summary?: any;
  exclusions?: any;
  deductibles?: string;
  validity_period?: string;
  raw_text?: string;
  file_size?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ParsedDocumentInfo {
  insuranceType: string;
  insurerName?: string;
  coverageSummary?: any;
  exclusions?: any;
  deductibles?: string;
  validityPeriod?: string;
}

export class DocumentSummaryService {
  /**
   * Save a document summary to the database
   */
  static async saveDocumentSummary(
    summary: DocumentSummary,
    userId?: string
  ): Promise<DocumentSummary> {
    try {
      const { data, error } = await supabase
        .from('document_summaries')
        .insert({
          ...summary,
          user_id: userId || null
        })
        .select()
        .single();

      if (error) {
        log(`Error saving document summary: ${error.message}`);
        throw error;
      }

      return data;
    } catch (error) {
      log(`Failed to save document summary: ${error}`);
      throw error;
    }
  }

  /**
   * Get document summaries for a user
   */
  static async getUserDocumentSummaries(
    userId: string,
    limit: number = 10
  ): Promise<DocumentSummary[]> {
    try {
      const { data, error } = await supabase
        .from('document_summaries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        log(`Error fetching document summaries: ${error.message}`);
        throw error;
      }

      return data || [];
    } catch (error) {
      log(`Failed to fetch document summaries: ${error}`);
      throw error;
    }
  }

  /**
   * Get a specific document summary by ID
   */
  static async getDocumentSummary(
    summaryId: string,
    userId?: string
  ): Promise<DocumentSummary | null> {
    try {
      let query = supabase
        .from('document_summaries')
        .select('*')
        .eq('id', summaryId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        log(`Error fetching document summary: ${error.message}`);
        throw error;
      }

      return data;
    } catch (error) {
      log(`Failed to fetch document summary: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a document summary
   */
  static async deleteDocumentSummary(
    summaryId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('document_summaries')
        .delete()
        .eq('id', summaryId)
        .eq('user_id', userId);

      if (error) {
        log(`Error deleting document summary: ${error.message}`);
        throw error;
      }

      return true;
    } catch (error) {
      log(`Failed to delete document summary: ${error}`);
      throw error;
    }
  }

  /**
   * Parse document summary to extract structured information
   */
  static parseDocumentSummary(summary: string): ParsedDocumentInfo {
    // Extract insurance type
    let insuranceType: string = 'other';
    if (summary.toLowerCase().includes('auto') || summary.toLowerCase().includes('vehículo')) {
      insuranceType = 'auto';
    } else if (summary.toLowerCase().includes('salud') || summary.toLowerCase().includes('médico')) {
      insuranceType = 'health';
    } else if (summary.toLowerCase().includes('viaje') || summary.toLowerCase().includes('travel')) {
      insuranceType = 'travel';
    } else if (summary.toLowerCase().includes('mascota') || summary.toLowerCase().includes('pet')) {
      insuranceType = 'pet';
    }

    // Extract insurer name (look for common patterns)
    let insurerName: string | undefined;
    const insurerMatch = summary.match(/(?:aseguradora|compañía|empresa):\s*([^\n,]+)/i);
    if (insurerMatch) {
      insurerName = insurerMatch[1].trim();
    }

    // Extract coverage summary
    const coverageMatch = summary.match(/(?:coberturas?|coverage):\s*([^]*?)(?=\n\n|exclusiones|deducibles|$)/i);
    const coverageSummary = coverageMatch ? 
      coverageMatch[1].trim().split('\n').filter(line => line.trim()) : 
      undefined;

    // Extract exclusions
    const exclusionsMatch = summary.match(/(?:exclusiones?|exclusions):\s*([^]*?)(?=\n\n|deducibles|vigencia|$)/i);
    const exclusions = exclusionsMatch ? 
      exclusionsMatch[1].trim().split('\n').filter(line => line.trim()) : 
      undefined;

    // Extract deductibles
    const deductiblesMatch = summary.match(/(?:deducibles?|deductibles):\s*([^\n]+)/i);
    const deductibles = deductiblesMatch ? deductiblesMatch[1].trim() : undefined;

    // Extract validity period
    const validityMatch = summary.match(/(?:vigencia|validity|período):\s*([^\n]+)/i);
    const validityPeriod = validityMatch ? validityMatch[1].trim() : undefined;

    return {
      insuranceType,
      insurerName,
      coverageSummary,
      exclusions,
      deductibles,
      validityPeriod
    };
  }
} 