import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { DocumentSummary, getUserDocumentSummaries, deleteDocumentSummary } from '../../services/document-upload-service';
import { useToast } from '../../hooks/use-toast';

interface DocumentHistoryProps {
  onViewSummary: (summary: DocumentSummary) => void;
  className?: string;
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  onViewSummary,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summaries, setSummaries] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isExpanded) {
      loadSummaries();
    }
  }, [isExpanded]);

  const loadSummaries = async () => {
    setIsLoading(true);
    try {
      const data = await getUserDocumentSummaries();
      setSummaries(data);
    } catch (error) {
      console.error('Error loading document summaries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (summaryId: string, filename: string) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el resumen de ${filename}?`);
    if (!confirmed) return;

    const success = await deleteDocumentSummary(summaryId);
    if (success) {
      setSummaries(prev => prev.filter(s => s.id !== summaryId));
      toast({
        title: "Documento eliminado",
        description: "El resumen del documento ha sido eliminado.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento.",
        variant: "destructive",
      });
    }
  };

  const getInsuranceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      auto: '🚗 Auto',
      health: '🏥 Salud',
      travel: '✈️ Viaje',
      pet: '🐾 Mascota',
      other: '📄 Otro'
    };
    return labels[type] || '📄 Seguro';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (summaries.length === 0 && !isExpanded) {
    return null;
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Documentos analizados ({summaries.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Cargando documentos...
                </div>
              ) : summaries.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay documentos analizados aún
                </div>
              ) : (
                summaries.map((summary) => (
                  <motion.div
                    key={summary.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {getInsuranceTypeLabel(summary.insurance_type)}
                        </span>
                        {summary.insurer_name && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • {summary.insurer_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {summary.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(summary.created_at!)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewSummary(summary)}
                        className="p-1 h-8 w-8"
                        title="Ver resumen"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(summary.id, summary.filename)}
                        className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 