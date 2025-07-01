import React from "react";
import { MessageCircleQuestion } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface SuggestedQuestionsProps {
  questions: string[];
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions }) => (
  <Card className="bg-blue-50/80 border-blue-200/60 my-6">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircleQuestion className="text-blue-600 w-5 h-5" />
        <span className="text-blue-900 font-medium text-sm">
          Solo unas preguntas rápidas antes de mostrarte opciones:
        </span>
      </div>
      <ul className="list-disc pl-6 text-blue-800 space-y-2">
        {questions.map((q, idx) => (
          <li key={idx} className="text-sm leading-relaxed">{q}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default SuggestedQuestions; 