import { apiRequest } from '../lib/api';

export interface DocumentUploadResponse {
  summary: string;
  fileName: string;
  fileSize: number;
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
    const response = await fetch('/api/ai/upload-document', {
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