import React from 'react';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface DocumentPreviewProps {
  fileName: string;
  fileSize?: number;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileName,
  fileSize,
  isError,
  onRetry,
  className
}) => {
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return ` • ${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg",
      isError ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20",
      className
    )}>
      {isError ? (
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      ) : (
        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          isError ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"
        )}>
          {fileName}
        </p>
        {fileSize && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF{formatFileSize(fileSize)}
          </p>
        )}
      </div>

      {isError && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="h-8 px-2 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Reintentar</span>
        </Button>
      )}
    </div>
  );
}; 