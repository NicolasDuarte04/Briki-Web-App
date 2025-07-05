import { describe, it, expect } from 'vitest';
import { analyzeContextNeeds, detectInsuranceCategory } from '../../shared/context-utils';
import { InsuranceCategory } from '../../shared/schema';
import { AssistantMemory } from '../../shared/types/assistant';

describe('Shared Context Utilities', () => {

  // --- Tests for detectInsuranceCategory ---
  it('should detect travel category from keywords', () => {
    expect(detectInsuranceCategory('Necesito un seguro para mi viaje a México')).toBe('travel');
  });

  it('should detect auto category from keywords', () => {
    expect(detectInsuranceCategory('¿Qué seguro de auto me recomiendas?')).toBe('auto');
  });

  it('should detect pet category from keywords', () => {
    expect(detectInsuranceCategory('Quiero asegurar a mi perro')).toBe('pet');
  });

  it('should detect health category from keywords', () => {
    expect(detectInsuranceCategory('Busco un seguro de salud')).toBe('health');
  });

  it('should return general for ambiguous messages', () => {
    expect(detectInsuranceCategory('Hola, ¿qué tal?')).toBe('general');
  });

  // --- Tests for analyzeContextNeeds ---
  it('should identify missing context for a travel query', () => {
    const conversation = 'Quiero un seguro de viaje';
    const category: InsuranceCategory = 'travel';
    const result = analyzeContextNeeds(conversation, category);

    expect(result.needsMoreContext).toBe(true);
    expect(result.missingInfo).toContain('destination');
    expect(result.missingInfo).toContain('origin');
    expect(result.missingInfo).toContain('duration');
    expect(result.suggestedQuestions.length).toBe(3);
  });

  it('should identify partially missing context for a travel query', () => {
    const conversation = 'Voy a viajar a Colombia por 2 semanas';
    const category: InsuranceCategory = 'travel';
    const result = analyzeContextNeeds(conversation, category);

    expect(result.needsMoreContext).toBe(true);
    expect(result.missingInfo).not.toContain('destination');
    expect(result.missingInfo).toContain('origin');
    expect(result.missingInfo).not.toContain('duration');
    expect(result.suggestedQuestions[0]).toBe('¿Desde dónde iniciarás tu viaje?');
  });

  it('should determine context is sufficient when all info is provided', () => {
    const conversation = 'Hola, busco un seguro de viaje. Salgo de Bogotá hacia Cancún y estaré allí por 15 días.';
    const category: InsuranceCategory = 'travel';
    const result = analyzeContextNeeds(conversation, category);

    expect(result.needsMoreContext).toBe(false);
    expect(result.missingInfo.length).toBe(0);
    expect(result.suggestedQuestions.length).toBe(0);
  });
  
  it('should require all 3 fields for health insurance', () => {
    const conversation = 'Tengo 30 años y soy mujer';
    const category: InsuranceCategory = 'health';
    const result = analyzeContextNeeds(conversation, category);
    
    expect(result.needsMoreContext).toBe(true);
    expect(result.missingInfo).toContain('location');
    expect(result.suggestedQuestions.length).toBe(1);
  });

  // --- New tests for natural language responses ---
  describe('Natural language responses', () => {
    it('should parse comma-separated travel response correctly', () => {
      const conversation = 'México, 10 días desde hoy, 1, turismo';
      const category: InsuranceCategory = 'travel';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
      expect(result.suggestedQuestions.length).toBe(0);
    });

    it('should parse health insurance response with city correctly', () => {
      const conversation = 'Mujer, 28 años, Medellín';
      const category: InsuranceCategory = 'health';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
      expect(result.suggestedQuestions.length).toBe(0);
    });

    it('should parse pet insurance response correctly', () => {
      const conversation = 'Pastor alemán, 3 años, Bogotá';
      const category: InsuranceCategory = 'pet';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
      expect(result.suggestedQuestions.length).toBe(0);
    });

    it('should handle bare numbers for travelers', () => {
      const conversation = 'Voy a Europa, 2 semanas, 2, turismo';
      const category: InsuranceCategory = 'travel';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
    });

    it('should handle accented text correctly', () => {
      const conversation = 'Perú, 5 días, 1 persona, vacaciones';
      const category: InsuranceCategory = 'travel';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
    });

    it('should extract country from city name', () => {
      const conversation = 'Hombre, 35 años, vivo en Guadalajara';
      const category: InsuranceCategory = 'health';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
    });

    it('should handle mixed format responses', () => {
      const conversation = 'Quiero asegurar a mi gato, tiene 5 años';
      const category: InsuranceCategory = 'pet';
      const result = analyzeContextNeeds(conversation, category);
      
      // Should only be missing location since we have pet type and age
      expect(result.needsMoreContext).toBe(true);
      expect(result.missingInfo).toEqual(['location']);
      expect(result.suggestedQuestions.length).toBe(1);
    });

    it('should handle auto insurance with year as bare number', () => {
      const conversation = 'Toyota Corolla, 2020, Colombia';
      const category: InsuranceCategory = 'auto';
      const result = analyzeContextNeeds(conversation, category);
      
      expect(result.needsMoreContext).toBe(false);
      expect(result.missingInfo.length).toBe(0);
    });

    it('should persist partial context in memory', () => {
      const memory: AssistantMemory = { preferences: {} };
      const conversation = 'Tengo 30 años';
      const category: InsuranceCategory = 'health';
      const result = analyzeContextNeeds(conversation, category, memory);
      
      // Should be missing gender and country
      expect(result.needsMoreContext).toBe(true);
      expect(result.missingInfo).toContain('gender');
      expect(result.missingInfo).toContain('country');
      
      // Memory should have age stored
      expect(memory.preferences?.age).toBe(true);
    });
  });

}); 