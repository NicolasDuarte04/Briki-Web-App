declare module 'formidable' {
  export interface File {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size: number;
  }

  export interface Options {
    multiples?: boolean;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    filter?: (part: any) => boolean;
  }

  export interface Fields {
    [key: string]: string[] | undefined;
  }

  export interface Files {
    [key: string]: File[] | undefined;
  }

  interface FormidableInstance {
    parse: (req: any, callback: (err: any, fields: Fields, files: Files) => void) => void;
  }

  export default function(options?: Options): FormidableInstance;
}