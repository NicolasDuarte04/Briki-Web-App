import { apiRequest } from '../lib/api';
import { getApiUrl } from '../lib/api-config';

export interface DocumentUploadResponse {
  summary: string;
  fileName: string;
  fileSize: number;
  summaryId?: string;
}

export interface DocumentSummary {
  id: string;
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

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  // Validate file before upload
  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Solo se permiten archivos PDF');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('El archivo no debe superar 10MB');
  }

  // Check if file is empty
  if (file.size === 0) {
    throw new Error('El archivo PDF está vacío');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const uploadUrl = getApiUrl('/api/ai/upload-document');
    if (process.env.NODE_ENV === 'development') {
      console.log('[Briki Debug] Uploading document to:', uploadUrl);
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Error al procesar el documento';
      
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
        
        // Provide user-friendly error messages
        if (errorMessage.includes('Invalid PDF')) {
          errorMessage = 'El archivo PDF parece estar dañado o no es válido';
        } else if (errorMessage.includes('No text found')) {
          errorMessage = 'No se pudo extraer texto del PDF. El documento podría ser una imagen escaneada';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'El procesamiento tardó demasiado. Por favor, intenta con un archivo más pequeño';
        }
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = `Error del servidor: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response data
    if (!data.summary || !data.fileName) {
      throw new Error('Respuesta del servidor incompleta');
    }

    return data;
  } catch (error) {
    // Re-throw with better error message if it's a network error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Error de conexión. Por favor, verifica tu conexión a internet');
    }
    
    throw error;
  }
}

export async function getUserDocumentSummaries(): Promise<DocumentSummary[]> {
  try {
    const response = await fetch('/api/ai/document-summaries', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document summaries');
    }

    const data = await response.json();
    return data.summaries || [];
  } catch (error) {
    console.error('Error fetching document summaries:', error);
    return [];
  }
}

export async function getDocumentSummary(summaryId: string): Promise<DocumentSummary | null> {
  try {
    const response = await fetch(`/api/ai/document-summaries/${summaryId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch document summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error fetching document summary:', error);
    return null;
  }
}

export async function deleteDocumentSummary(summaryId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/ai/document-summaries/${summaryId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting document summary:', error);
    return false;
  }
} 