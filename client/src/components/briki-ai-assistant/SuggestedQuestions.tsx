import React from "react";
import { MessageCircleQuestion } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions }) => (
  <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900 dark:to-cyan-950 p-5 rounded-xl shadow border border-sky-200 dark:border-cyan-900 mb-4 flex flex-col gap-2">
    <div className="flex items-center gap-2 mb-2">
      <MessageCircleQuestion className="text-sky-500 dark:text-cyan-300 w-5 h-5" />
      <span className="text-sky-800 dark:text-cyan-100 font-semibold text-base">
        Solo unas preguntas rápidas antes de mostrarte opciones:
      </span>
    </div>
    <ul className="list-disc pl-6 text-sky-900 dark:text-cyan-100 space-y-1">
      {questions.map((q, idx) => (
        <li key={idx} className="text-base">{q}</li>
      ))}
    </ul>
  </div>
);

export default SuggestedQuestions; 