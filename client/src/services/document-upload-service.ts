import { apiRequest } from '../lib/api';

export interface DocumentUploadResponse {
  summary: string;
  fileName: string;
  fileSize: number;
}

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/ai/upload-document', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload document');
  }

  return response.json();
} 