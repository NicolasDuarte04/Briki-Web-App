import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading = false,
  maxSize = 10,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`El archivo no debe superar ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isUploading ? 'Procesando...' : 'Subir documento'}
              </span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2"
          >
            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={clearFile}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-1 left-0 right-0 flex items-center gap-1 text-red-600 text-xs"
        >
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}; 