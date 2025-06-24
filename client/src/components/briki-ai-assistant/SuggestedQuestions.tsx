import React from "react";
import { MessageCircleQuestion } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions }) => (
  <div className="bg-blue-50 p-3 rounded-lg my-2">
    <div className="flex items-center gap-2 mb-2">
      <MessageCircleQuestion className="text-blue-600 w-4 h-4" />
      <span className="text-blue-900 font-medium text-sm">
        Solo unas preguntas rápidas antes de mostrarte opciones:
      </span>
    </div>
    <ul className="list-disc pl-5 text-blue-800 space-y-1">
      {questions.map((q, idx) => (
        <li key={idx} className="text-sm leading-snug">{q}</li>
      ))}
    </ul>
  </div>
);

export default SuggestedQuestions; 