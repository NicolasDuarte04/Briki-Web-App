export interface AssistantMemory {
  vehicle?: {
    plate: string;
    make: string;
    model: string;
    year: number;
    fuel: string;
    bodyType?: string;
    transmission?: string;
    color?: string;
  };
  preferences?: {
    preferredProviders?: string[];
    mustHaveFeatures?: string[];
    priceRange?: {
      min: number;
      max: number;
      currency: string;
    };
    location?: string;
  };
  lastDetectedCategory?: string;
  recentDocument?: {
    fileName?: string;
    fileSize?: number;
    summaryId?: string;
    summary?: string;
    uploadTime?: string;
  };
  lastUploadedDocument?: {
    fileName?: string;
    fileSize?: number;
    summaryId?: string;
    summary?: string;
    uploadTime?: string;
  };
} 