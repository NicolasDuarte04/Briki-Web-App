import { Router } from 'express';
import { INSURANCE_CATEGORIES, InsuranceCategory } from '../../shared/schema';
import { mockStorage } from '../storage';
import { 
  prepareAIContext, 
  PlanFilters, 
  filterPlansByAttributes, 
  filterPlansByTags,
  filterPlansByUserNeed
} from '../data-loader';
import { semanticSearch } from '../services/semantic-search';

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
    console.log(`Buscando planes con tags: ${tags.join(', ')}`);
    
    // Obtener todos los planes para verificar qué tags existen
    const allPlans = await mockStorage.getAllInsurancePlans();
    console.log(`Tags disponibles en los planes:`);
    allPlans.forEach(plan => {
      if (plan.tags && plan.tags.length > 0) {
        console.log(`- Plan ${plan.id}: ${plan.tags.join(', ')}`);
      }
    });
    
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

// Búsqueda semántica de planes
router.get('/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere un texto para la búsqueda' });
    }
    
    // Obtener todos los planes
    const allPlans = await mockStorage.getAllInsurancePlans();
    
    // Realizar búsqueda semántica
    const maxResults = limit ? parseInt(limit as string, 10) : 5;
    const results = semanticSearch(query as string, allPlans, maxResults);
    
    res.json({
      results,
      count: results.length,
      query: query
    });
  } catch (error: any) {
    console.error('Error en búsqueda semántica:', error);
    res.status(500).json({ 
      error: 'Error al realizar la búsqueda semántica',
      details: error.message || 'Error desconocido'
    });
  }
});

// Filtrado avanzado por atributos
router.post('/filter', async (req, res) => {
  try {
    const filters = req.body as PlanFilters;
    
    if (!filters || Object.keys(filters).length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un criterio de filtrado' });
    }
    
    // Obtener todos los planes
    const allPlans = await mockStorage.getAllInsurancePlans();
    
    // Aplicar filtros
    const results = filterPlansByAttributes(allPlans, filters);
    
    res.json({
      results,
      count: results.length,
      filters: filters
    });
  } catch (error: any) {
    console.error('Error al filtrar planes:', error);
    res.status(500).json({ 
      error: 'Error al filtrar planes por atributos',
      details: error.message || 'Error desconocido'
    });
  }
});

// Obtener contexto para IA con soporte para búsqueda semántica
router.get('/ai-context', async (req, res) => {
  try {
    const { category, need, query, maxPlans, region, minPrice, maxPrice } = req.query;
    let plans = await mockStorage.getAllInsurancePlans();
    
    // Filtrar por categoría si se especifica
    if (category && Object.values(INSURANCE_CATEGORIES).includes(category as InsuranceCategory)) {
      plans = await mockStorage.getInsurancePlansByCategory(category as InsuranceCategory);
    }
    
    // Filtrar por necesidad si se especifica
    if (need) {
      plans = await mockStorage.getInsurancePlansByUserNeed(need as string);
    }
    
    // Aplicar búsqueda semántica si se proporciona una consulta
    if (query) {
      plans = semanticSearch(query as string, plans, 10);
    }
    
    // Aplicar filtros adicionales si existen
    if (region || minPrice || maxPrice) {
      const filters: PlanFilters = {};
      
      if (region) {
        filters.region = region as string;
      }
      
      if (minPrice) {
        filters.minPrice = parseFloat(minPrice as string);
      }
      
      if (maxPrice) {
        filters.maxPrice = parseFloat(maxPrice as string);
      }
      
      plans = filterPlansByAttributes(plans, filters);
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
  } catch (error: any) {
    console.error('Error al generar contexto para IA:', error);
    res.status(500).json({ 
      error: 'Error al generar contexto para IA',
      details: error.message || 'Error desconocido'
    });
  }
});

// Búsqueda unificada para el asistente de IA (combina todas las técnicas)
router.post('/assistant-search', async (req, res) => {
  try {
    const { 
      query, 
      category, 
      need, 
      region, 
      minPrice, 
      maxPrice, 
      minRating,
      tags,
      limit 
    } = req.body;
    
    let plans = await mockStorage.getAllInsurancePlans();
    const searchMethods = [];
    
    // 1. Filtrar por categoría si se especifica
    if (category && Object.values(INSURANCE_CATEGORIES).includes(category as InsuranceCategory)) {
      plans = await mockStorage.getInsurancePlansByCategory(category as InsuranceCategory);
      searchMethods.push('category');
    }
    
    // 2. Aplicar búsqueda semántica si hay consulta
    if (query) {
      // Si ya se filtró por categoría, mantener ese filtro
      if (category) {
        // Hacer búsqueda semántica dentro de la categoría
        const allPlansInCategory = await mockStorage.getInsurancePlansByCategory(category as InsuranceCategory);
        plans = semanticSearch(query as string, allPlansInCategory, 20);
      } else {
        // Búsqueda semántica en todos los planes
        plans = semanticSearch(query as string, plans, 20);
      }
      searchMethods.push('semantic');
    }
    
    // 3. Filtrar por necesidad específica
    if (need) {
      // Aplicar filtro de necesidad a los resultados actuales
      plans = filterPlansByUserNeed(plans, need as string);
      searchMethods.push('need');
    }
    
    // 4. Filtrar por tags si se especifican
    if (tags && Array.isArray(tags) && tags.length > 0) {
      plans = filterPlansByTags(plans, tags);
      searchMethods.push('tags');
    }
    
    // 5. Aplicar filtros avanzados
    const advancedFilters: PlanFilters = {};
    
    if (region) {
      advancedFilters.region = region as string;
    }
    
    if (minPrice !== undefined) {
      advancedFilters.minPrice = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
    }
    
    if (maxPrice !== undefined) {
      advancedFilters.maxPrice = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    }
    
    if (minRating !== undefined) {
      advancedFilters.minRating = typeof minRating === 'string' ? parseFloat(minRating) : minRating;
    }
    
    if (Object.keys(advancedFilters).length > 0) {
      plans = filterPlansByAttributes(plans, advancedFilters);
      searchMethods.push('attributes');
    }
    
    // Limitar resultados
    const maxResults = limit ? (typeof limit === 'string' ? parseInt(limit, 10) : limit) : 5;
    const limitedResults = plans.slice(0, maxResults);
    
    // Generar contexto para IA
    const context = prepareAIContext(limitedResults, limitedResults.length);
    
    res.json({
      results: limitedResults,
      count: limitedResults.length,
      totalMatchesBeforeLimit: plans.length,
      searchMethods,
      context
    });
  } catch (error: any) {
    console.error('Error en búsqueda unificada para asistente:', error);
    res.status(500).json({ 
      error: 'Error al realizar la búsqueda unificada',
      details: error.message || 'Error desconocido'
    });
  }
});

export default router;