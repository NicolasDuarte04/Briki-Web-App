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
} 