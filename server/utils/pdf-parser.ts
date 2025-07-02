import pdf from 'pdf-parse';

export async function parsePdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    
    // Clean up the text by removing excessive whitespace and normalizing line breaks
    const cleanedText = data.text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return cleanedText || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document');
  }
}

export function truncateTextForGPT(text: string, maxLength: number = 8000): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to truncate at a sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.8) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  return truncated + '...';
} 