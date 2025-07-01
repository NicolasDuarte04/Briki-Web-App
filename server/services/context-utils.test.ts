import { describe, it, expect } from 'vitest';
import { analyzeContextNeeds, detectInsuranceCategory, InsuranceCategory } from '../../shared/context-utils';

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

}); 