import React from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { DocumentSummary } from '../../services/document-upload-service';
import { Plan } from '../../types/chat';

interface DocumentComparisonProps {
  document: DocumentSummary;
  plans: Plan[];
  className?: string;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  document,
  plans,
  className
}) => {
  const renderComparisonItem = (label: string, docValue: any, planValue: any) => {
    const hasDocValue = docValue && (Array.isArray(docValue) ? docValue.length > 0 : true);
    const hasPlanValue = planValue && (Array.isArray(planValue) ? planValue.length > 0 : true);

    return (
      <div className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            {hasDocValue ? (
              <div className="flex items-start gap-1">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  {Array.isArray(docValue) ? (
                    <ul className="list-disc list-inside">
                      {docValue.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    docValue
                  )}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <XCircle className="w-4 h-4" />
                <span>No especificado</span>
              </div>
            )}
          </div>
          <div className="text-sm">
            {hasPlanValue ? (
              <div className="flex items-start gap-1">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  {Array.isArray(planValue) ? (
                    <ul className="list-disc list-inside">
                      {planValue.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {planValue.length > 3 && (
                        <li className="text-gray-500">+{planValue.length - 3} más</li>
                      )}
                    </ul>
                  ) : (
                    planValue
                  )}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>No disponible</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", className)}
    >
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comparación de Seguros
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tu póliza actual</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {document.insurer_name || 'Aseguradora no especificada'}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Planes Briki</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {plans.length} {plans.length === 1 ? 'plan disponible' : 'planes disponibles'}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {renderComparisonItem(
          "Coberturas",
          document.coverage_summary,
          plans[0]?.benefits || plans[0]?.features
        )}
        
        {renderComparisonItem(
          "Exclusiones",
          document.exclusions,
          null // Plans typically don't list exclusions in our data
        )}
        
        {renderComparisonItem(
          "Deducibles",
          document.deductibles,
          plans[0]?.basePrice ? `Desde $${plans[0].basePrice.toLocaleString('es-CO')}` : null
        )}
        
        {renderComparisonItem(
          "Vigencia",
          document.validity_period,
          "Cobertura anual renovable"
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Recomendación
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {plans.length > 0 
                ? `Hemos encontrado ${plans.length} ${plans.length === 1 ? 'plan' : 'planes'} que podrían mejorar tu cobertura actual. Revisa las opciones disponibles y compara beneficios.`
                : "No encontramos planes similares en este momento. Intenta ajustar tus criterios de búsqueda."
              }
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 