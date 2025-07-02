declare module 'pdf-parse' {
  interface PDFInfo {
    [key: string]: any;
  }

  interface PDFMetadata {
    [key: string]: any;
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata;
    text: string;
    version: string;
  }

  function pdf(dataBuffer: Buffer, options?: any): Promise<PDFData>;

  export = pdf;
} 