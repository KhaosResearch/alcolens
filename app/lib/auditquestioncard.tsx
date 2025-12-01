import React from "react";
import {studyLevel, auditQuestions} from "@/app/api/audit";

interface Props{
    question: auditQuestions;
    studyLevel: studyLevel;
    onAnswer: (value: number) => void;
}

export default function AuditQuestionCard({question, studyLevel, onAnswer}: Props) {
    if (!question) {
        return <div>Cargando...</div>;
    }

    const questionTitle = question.question[studyLevel];
    const helpText = question.contextHelp ? question.contextHelp[studyLevel] : null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {questionTitle}
          </h3>
    
          {helpText && (
            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md mb-6">
              💡 {helpText}
            </div>
          )}
    
          <div className="space-y-3">
            {question.answerOptions.map((opcion) => (
              <button
                key={opcion.valor}
                onClick={() => onAnswer(opcion.valor)}
                className="w-full text-left p-4 rounded-lg border hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200"
              >
                <span className="font-medium text-gray-700">
                   {opcion.texto[studyLevel]}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }