import React from 'react';
import { motion } from 'framer-motion';
import { Info, ExternalLink } from 'lucide-react';

interface GlossaryCardProps {
  term: string;
  definition: string;
  icon?: string;
  source?: string;
  sourceUrl?: string;
}

/**
 * GlossaryCard displays insurance terminology with definitions
 * Used by the AI Assistant to provide educational content inline
 */
export const GlossaryCard: React.FC<GlossaryCardProps> = ({
  term,
  definition,
  icon,
  source,
  sourceUrl
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-3 w-full max-w-md rounded-lg border border-gray-100 bg-white p-4 shadow-md"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          {icon ? (
            <img src={icon} alt={term} className="h-6 w-6" />
          ) : (
            <Info className="h-5 w-5 text-blue-500" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{term}</h3>
      </div>
      
      <p className="mt-2 text-gray-600">{definition}</p>
      
      {(source || sourceUrl) && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <span>Source:</span>
          {sourceUrl ? (
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              {source || sourceUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span>{source}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GlossaryCard;