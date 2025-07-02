import express from 'express';
import { generateAssistantResponse, analyzeImageForInsurance } from '../services/openai-service';
// DEPRECATED: Mock data loader is no longer used
// import { loadMockInsurancePlans, filterPlansByCategory } from '../data-loader';
import { generateMockResponse } from '../services/mock-assistant-responses';
import { semanticSearch } from '../services/semantic-search';
import { db } from '../db';
import { conversationLogs, contextSnapshots, insurancePlans } from '../../shared/schema';
import { desc, eq } from 'drizzle-orm';
import multer from 'multer';
import { parsePdfText, truncateTextForGPT } from '../utils/pdf-parser';
import OpenAI from 'openai';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

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
  const requestTime = new Date().toISOString();
  console.log(`[AI Route] /api/ai/chat hit at ${requestTime} from ${req.ip}`);
  
  // Enhanced logging for production debugging
  console.log('[AI Route] Request headers:', {
    contentType: req.headers['content-type'],
    origin: req.headers.origin,
    referer: req.headers.referer,
    userAgent: req.headers['user-agent']
  });

  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      console.error('[AI Route] Invalid request body:', req.body);
      return res.status(400).json({ 
        error: 'Invalid request body',
        details: 'Request body must be a JSON object'
      });
    }
    
    const { message, conversationHistory, memory, category = 'general', resetContext = false } = req.body;
    const userId = req.session?.user?.id || null;

    // Add detailed input validation logging
    console.log('[AI Route] Parsed request data:', {
      hasMessage: !!message,
      messageType: typeof message,
      messageLength: message?.length,
      messagePreview: message ? message.substring(0, 50) + '...' : 'null',
      hasHistory: !!conversationHistory,
      historyLength: conversationHistory?.length,
      hasMemory: !!memory,
      memoryKeys: memory ? Object.keys(memory) : [],
      category,
      resetContext,
      userId,
      sessionExists: !!req.session
    });

    if (!message || typeof message !== 'string') {
      console.error('[AI Route] Invalid message:', message);
      return res.status(400).json({ 
        error: 'Se requiere un mensaje válido',
        details: `Message type: ${typeof message}, value: ${message}`
      });
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
    
    // CRITICAL DEBUG: Log exactly what we're sending
    console.log('[AI Route] Sending response to frontend:', {
      hasMessage: !!response.message,
      hasResponse: !!response.response,
      messageLength: response.message?.length,
      responseType: typeof response,
      responseKeys: Object.keys(response),
      fullResponse: JSON.stringify(response, null, 2)
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
 * Endpoint para analizar PDFs de seguros y generar un resumen estructurado
 */
router.post('/upload-document', upload.single('file'), async (req, res) => {
  try {
    const userId = req.session?.user?.id || null;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from PDF
    let rawText: string;
    try {
      rawText = await parsePdfText(req.file.buffer);
    } catch (parseError: any) {
      console.error('PDF parsing error:', parseError);
      return res.status(400).json({ 
        error: 'Failed to parse PDF document',
        details: parseError.message 
      });
    }

    if (!rawText || rawText.length < 50) {
      return res.status(400).json({ 
        error: 'Unable to extract meaningful text from the PDF' 
      });
    }

    // Truncate text if too long for GPT
    const truncatedText = truncateTextForGPT(rawText, 8000);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate summary using GPT-4
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Eres un asistente técnico especializado en seguros. Tu tarea es analizar documentos de pólizas de seguros y proporcionar un resumen estructurado y claro en español.

Para cada documento debes extraer y presentar:
1. **Tipo de seguro**: Identifica si es auto, salud, viaje, mascota, etc.
2. **Aseguradora**: Nombre de la compañía aseguradora
3. **Coberturas principales**: Lista las coberturas más importantes con sus límites
4. **Exclusiones relevantes**: Las exclusiones más importantes que el asegurado debe conocer
5. **Deducibles**: Montos de deducibles aplicables
6. **Vigencia**: Período de cobertura y condiciones de renovación
7. **Información adicional**: Cualquier otra información relevante

Formato de respuesta:
📄 **Resumen del Clausulado**

🔹 **Tipo de seguro**: [tipo]
🏢 **Aseguradora**: [nombre]

✅ **Coberturas principales**:
• [cobertura 1 con límite]
• [cobertura 2 con límite]
• [etc.]

⚠️ **Exclusiones importantes**:
• [exclusión 1]
• [exclusión 2]
• [etc.]

💰 **Deducibles**:
• [deducible 1]
• [deducible 2]

📅 **Vigencia**: [período y condiciones]

📌 **Información adicional**:
• [dato relevante 1]
• [dato relevante 2]

Si no puedes encontrar alguna información, indícalo como "No especificado en el documento".`
          },
          {
            role: "user",
            content: `Analiza el siguiente documento de seguro y proporciona un resumen estructurado:\n\n${truncatedText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const summary = completion.choices[0]?.message?.content || 'No se pudo generar un resumen.';

      // Log the document analysis
      await logConversation({
        userId,
        category: 'document-analysis',
        input: `PDF Document Analysis: ${req.file.originalname}`,
        output: summary,
        memoryJson: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          textLength: rawText.length,
          truncated: rawText.length > 8000
        }
      });

      return res.json({ 
        summary,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      return res.status(500).json({ 
        error: 'Failed to generate document summary',
        details: openaiError.message 
      });
    }

  } catch (error: any) {
    console.error('Error processing document upload:', error);
    return res.status(500).json({ 
      error: 'Error processing document',
      details: error.message || 'Unknown error'
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