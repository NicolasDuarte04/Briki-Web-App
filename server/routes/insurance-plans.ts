import { Router } from 'express';
import { INSURANCE_CATEGORIES, InsuranceCategory } from '@shared/schema';
import { mockStorage } from '../storage';
import { prepareAIContext } from '../data-loader';

const router = Router();

// Obtener todos los planes de seguro
router.get('/', async (_req, res) => {
  try {
    const plans = await mockStorage.getAllInsurancePlans();
    res.json(plans);
  } catch (error) {
    console.error('Error al obtener planes de seguro:', error);
    res.status(500).json({ error: 'Error al obtener planes de seguro' });
  }
});

// Obtener planes por categoría
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validar que la categoría es válida
    if (!Object.values(INSURANCE_CATEGORIES).includes(category as InsuranceCategory)) {
      return res.status(400).json({ 
        error: 'Categoría inválida',
        validCategories: Object.values(INSURANCE_CATEGORIES)
      });
    }
    
    const plans = await mockStorage.getInsurancePlansByCategory(category as InsuranceCategory);
    res.json(plans);
  } catch (error) {
    console.error('Error al obtener planes por categoría:', error);
    res.status(500).json({ error: 'Error al obtener planes por categoría' });
  }
});

// Buscar planes por tags
router.get('/tags', async (req, res) => {
  try {
    const tagsParam = req.query.tags as string;
    
    if (!tagsParam) {
      return res.status(400).json({ error: 'Se requiere al menos un tag' });
    }
    
    const tags = tagsParam.split(',').map(tag => tag.trim());
    const plans = await mockStorage.getInsurancePlansByTags(tags);
    
    res.json(plans);
  } catch (error) {
    console.error('Error al buscar planes por tags:', error);
    res.status(500).json({ error: 'Error al buscar planes por tags' });
  }
});

// Buscar planes por necesidad del usuario
router.get('/need', async (req, res) => {
  try {
    const need = req.query.q as string;
    
    if (!need) {
      return res.status(400).json({ error: 'Se requiere una necesidad para la búsqueda' });
    }
    
    const plans = await mockStorage.getInsurancePlansByUserNeed(need);
    
    res.json(plans);
  } catch (error) {
    console.error('Error al buscar planes por necesidad:', error);
    res.status(500).json({ error: 'Error al buscar planes por necesidad' });
  }
});

// Obtener contexto para IA
router.get('/ai-context', async (req, res) => {
  try {
    const { category, need, maxPlans } = req.query;
    let plans = await mockStorage.getAllInsurancePlans();
    
    // Filtrar por categoría si se especifica
    if (category && Object.values(INSURANCE_CATEGORIES).includes(category as InsuranceCategory)) {
      plans = await mockStorage.getInsurancePlansByCategory(category as InsuranceCategory);
    }
    
    // Filtrar por necesidad si se especifica
    if (need) {
      plans = await mockStorage.getInsurancePlansByUserNeed(need as string);
    }
    
    // Limitar el número de planes
    const limit = maxPlans ? parseInt(maxPlans as string, 10) : 3;
    
    // Generar el contexto para la IA
    const context = prepareAIContext(plans, limit);
    
    res.json({ 
      context,
      plansIncluded: Math.min(plans.length, limit),
      totalPlansAvailable: plans.length
    });
  } catch (error) {
    console.error('Error al generar contexto para IA:', error);
    res.status(500).json({ error: 'Error al generar contexto para IA' });
  }
});

export default router;