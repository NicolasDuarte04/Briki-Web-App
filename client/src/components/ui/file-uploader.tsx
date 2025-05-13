import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelected: (file: File) => void;
  className?: string;
}

export function FileUploader({ 
  accept = ".csv,.xlsx,.xls", 
  maxSize = 5,
  onFileSelected,
  className = ""
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Reset error
    setError(null);
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.trim().replace('.', '').toLowerCase());
    
    if (!acceptedTypes.includes(fileType || '')) {
      setError(`Invalid file type. Please upload ${accept} files only.`);
      return;
    }
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds the maximum limit of ${maxSize}MB.`);
      return;
    }
    
    // Set the file and call the callback
    setFile(file);
    onFileSelected(file);
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        id="file-upload"
      />
      
      {file ? (
        <div className="border rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{file.name}</h4>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
            <div className="flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">
                {accept.split(',').join(', ')} (max. {maxSize}MB)
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Browse Files
            </Button>
          </label>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}