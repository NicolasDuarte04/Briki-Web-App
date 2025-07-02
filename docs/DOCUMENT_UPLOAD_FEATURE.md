# Document Upload Feature for AskBriki AI Assistant

## Overview

The AskBriki AI Assistant now supports PDF document upload and parsing. Users can upload insurance policy documents (clausulados, claim files, etc.) and receive structured summaries directly in the chat interface.

## Features

- **PDF Upload**: Upload PDF documents up to 10MB
- **AI-Powered Analysis**: Uses GPT-4 to extract and summarize key information
- **Structured Output**: Returns organized information including:
  - Insurance type
  - Main coverages with limits
  - Important exclusions
  - Deductibles
  - Policy validity period
  - Additional relevant information

## Implementation Details

### Frontend Components

1. **FileUpload Component** (`client/src/components/briki-ai-assistant/FileUpload.tsx`)
   - Handles file selection and validation
   - Shows upload progress and file information
   - Validates file type (PDF only) and size (max 10MB)

2. **NewBrikiAssistant Integration**
   - Added document upload handler
   - Shows processing message while analyzing
   - Displays structured summary in chat

### Backend Implementation

1. **PDF Parser** (`server/utils/pdf-parser.ts`)
   - Extracts text from PDF buffers using `pdf-parse`
   - Cleans and normalizes extracted text
   - Truncates text for GPT processing (8000 char limit)

2. **Upload Endpoint** (`server/routes/ai.ts`)
   - Route: `POST /api/ai/upload-document`
   - Uses Multer for file handling
   - Validates file type and size
   - Processes PDF and sends to GPT-4 for analysis

3. **Document Upload Service** (`client/src/services/document-upload-service.ts`)
   - Handles API communication
   - Returns structured response

## Usage

1. Click the "Subir documento" button next to the chat input
2. Select a PDF file (insurance policy, claim document, etc.)
3. The assistant will process the document and display a structured summary
4. The summary includes all key policy information in an organized format

## Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### File Limits
- Maximum file size: 10MB
- Supported formats: PDF only
- Text extraction limit: 8000 characters for GPT processing

## Security Considerations

- Files are processed in memory only (not stored)
- File type validation prevents non-PDF uploads
- Size limits prevent abuse
- User authentication tracked for audit trail

## Example Output

```
📄 Resumen del Clausulado:

🔹 Tipo de seguro: Auto
🏢 Aseguradora: Seguros Bolívar

✅ Coberturas principales:
• Responsabilidad civil hasta $640M COP
• Daños parciales por hurto
• Pérdida total por daños

⚠️ Exclusiones importantes:
• No cubre uso comercial del vehículo
• No cubre conducir en estado de embriaguez
• No cubre daños intencionales

💰 Deducibles:
• Pérdida parcial: 1.5 SMMLV
• Pérdida total: 10% del valor asegurado

📅 Vigencia: 12 meses con renovación automática

📌 Información adicional:
• Asistencia en carretera 24/7
• Vehículo de reemplazo por 15 días
```

## Future Enhancements

- Support for multiple file formats (images, Word docs)
- Document comparison features
- Claims guidance based on policy analysis
- Integration with renewal reminders
- Multi-language document support 