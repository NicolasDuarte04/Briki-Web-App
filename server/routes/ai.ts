import express from 'express';
import { generateAssistantResponse, analyzeImageForInsurance } from '../services/openai-service';
// DEPRECATED: Mock data loader is no longer used
// import { loadMockInsurancePlans, filterPlansByCategory } from '../data-loader';
import { generateMockResponse } from '../services/mock-assistant-responses';
import { semanticSearch } from '../services/semantic-search';
import { db } from '../db';
import { conversationLogs, contextSnapshots, insurancePlans } from '@shared/schema';
import { desc, eq } from 'drizzle-orm';

const router = express.Router();

// Helper function for logging conversations
const logConversation = async (logData: {
  userId: string | null;
  category: string;
  input: string;
  output: string | null;
  memoryJson?: object;
}) => {
  try {
    const [conversation] = await db.insert(conversationLogs).values({
      userId: logData.userId,
      category: logData.category,
      input: logData.input,
      output: logData.output,
    }).returning();

    if (conversation && logData.memoryJson && Object.keys(logData.memoryJson).length > 0) {
      await db.insert(contextSnapshots).values({
        conversationId: conversation.id,
        memoryJson: logData.memoryJson,
      });
    }
  } catch (error) {
    console.warn('[AI Logging] Failed to write conversation log:', error);
  }
};

/**
 * Endpoint para generar respuestas del asistente IA
 */
router.post('/chat', async (req, res) => {
  console.log(`[AI Route] /api/ai/chat hit at ${new Date().toISOString()} from ${req.ip}`);

  try {
    const { message, conversationHistory, memory, category = 'general', resetContext = false } = req.body;
    const userId = req.session.user?.id || null;

    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    const formattedHistory = (conversationHistory || []).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    let response;
    try {
      response = await generateAssistantResponse(message, formattedHistory, memory, "Colombia", userId, resetContext);
    } catch (innerError: any) {
      console.error('[AI Route] Error generating assistant response:', innerError);
      console.error('[AI Route] Stack trace:', innerError.stack);
      
      // Return a safe fallback response
      return res.json({
        message: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
        response: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
        suggestedPlans: [],
        category: 'general',
        memory: memory || {},
        needsMoreContext: false,
        suggestedQuestions: []
      });
    }
    
    // Validate response structure before sending
    if (!response || typeof response !== 'object') {
      console.error('[AI Route] Invalid response structure:', response);
      return res.json({
        message: "Error: respuesta inválida del asistente",
        response: "Error: respuesta inválida del asistente",
        suggestedPlans: [],
        category: 'general',
        memory: memory || {},
        needsMoreContext: false,
        suggestedQuestions: []
      });
    }
    
    // Log the interaction
    logConversation({
      userId,
      category,
      input: message,
      output: response.message || null,
      memoryJson: response.memory,
    });
    
    // Ensure proper JSON response
    res.setHeader('Content-Type', 'application/json');
    return res.json(response);
  } catch (error: any) {
    console.error('Error en el chat IA:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message || 'Error desconocido'
    });
  }
});

/**
 * Legacy endpoint - kept for backward compatibility
 */
router.post('/ask', async (req, res) => {
  try {
    const { message, history, useOpenAI = true, category = 'legacy-ask', memory } = req.body;
    const userId = req.session.user?.id || null;
    
    console.log(`[AI Route] Request received:`, {
      messageLength: message?.length || 0,
      hasHistory: !!history,
      useOpenAI,
      category: category || 'not specified',
      timestamp: new Date().toISOString()
    });

    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    // Always use OpenAI service which now exclusively uses database plans
    try {
      const response = await generateAssistantResponse(message, history || [], memory);
      
      // Log the interaction
      logConversation({
        userId,
        category,
        input: message,
        output: response.message || null,
        memoryJson: response.memory,
      });
      
      return res.json(response);
    } catch (error: any) {
      console.error(`[AI Service] Error generating response: ${error.message}`);
      
      // Return a helpful error message
      return res.json({
        message: "Lo siento, encontré un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.",
        suggestedPlans: [],
        error: true
      });
    }
  } catch (error: any) {
    console.error('Error en el asistente IA:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message || 'Error desconocido'
    });
  }
});

/**
 * Endpoint para analizar imágenes con IA para recomendaciones de seguros
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, prompt, useOpenAI = true } = req.body;
    const userId = req.session.user?.id || null;

    if (!image) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    // Extraer datos de base64 (eliminar prefijo si existe)
    const base64Data = image.includes('base64,') 
      ? image.split('base64,')[1] 
      : image;

    if (useOpenAI) {
      try {
        const response = await analyzeImageForInsurance(base64Data, prompt);
        
        // For now, image analysis doesn't use structured memory, but we log its output.
        logConversation({
          userId,
          category: 'image-analysis',
          input: prompt || 'Image analysis task',
          output: response.message || null,
          // No memoryJson for this endpoint yet
        });

        return res.json(response);
      } catch (error: any) {
        console.warn("Error al usar OpenAI para análisis de imagen, usando respuesta mock como fallback:", error.message);
        // Si hay error con OpenAI, usar respuesta mock como fallback
      }
    } 
    
    // Usar respuesta mock para desarrollo o como fallback
    {
      // Respuesta mock para desarrollo
      return res.json({
        message: "He analizado la imagen y parece que podrías necesitar un seguro de viaje para tus próximas vacaciones. Considera nuestro Plan Básico de Viaje que ofrece cobertura médica y protección de equipaje."
      });
    }
  } catch (error: any) {
    console.error('Error al analizar imagen:', error);
    res.status(500).json({ 
      error: 'Error al analizar la imagen',
      details: error.message || 'Error desconocido'
    });
  }
});

/**
 * Get conversation history for authenticated user
 */
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Get conversations for this user, grouped by conversation sessions
    // For now, we'll treat each individual message as a conversation entry
    // In the future, you might want to group by conversation sessions
    const conversations = await db
      .select({
        id: conversationLogs.id,
        input: conversationLogs.input,
        output: conversationLogs.output,
        category: conversationLogs.category,
        timestamp: conversationLogs.timestamp,
      })
      .from(conversationLogs)
      .where(eq(conversationLogs.userId, userId))
      .orderBy(desc(conversationLogs.timestamp))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: conversationLogs.id })
      .from(conversationLogs)
      .where(eq(conversationLogs.userId, userId));
    
    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      conversations,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error: any) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ 
      error: 'Error fetching conversation history',
      details: error.message || 'Unknown error'
    });
  }
});

/**
 * Get a specific conversation with its context
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const conversationId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!conversationId || isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    // Get the specific conversation
    const conversation = await db
      .select()
      .from(conversationLogs)
      .where(
        eq(conversationLogs.id, conversationId)
      )
      .then(rows => rows[0]);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify ownership
    if (conversation.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get associated context snapshots
    const contextSnapshotsList = await db
      .select()
      .from(contextSnapshots)
      .where(eq(contextSnapshots.conversationId, conversationId))
      .orderBy(desc(contextSnapshots.createdAt));

    return res.json({
      conversation,
      contextSnapshots: contextSnapshotsList
    });
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ 
      error: 'Error fetching conversation',
      details: error.message || 'Unknown error'
    });
  }
});

/**
 * Temporary debug endpoint to view latest logs
 */
router.get('/logs/test', async (req, res) => {
  try {
    const last10ConversationLogs = await db
      .select()
      .from(conversationLogs)
      .orderBy(desc(conversationLogs.timestamp))
      .limit(10);

    const logsWithContext = await Promise.all(last10ConversationLogs.map(async (log) => {
      const context = await db.select().from(contextSnapshots).where(eq(contextSnapshots.conversationId, log.id));
      return { ...log, context };
    }));

    return res.json({ conversationLogs: logsWithContext });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      error: 'Error fetching logs',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;