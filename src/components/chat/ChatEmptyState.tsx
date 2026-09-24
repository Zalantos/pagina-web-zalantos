'use client'

interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void
}

const SUGGESTIONS = [
  "¿Qué servicios ofrece zalantos?",
  "¿Cómo implementan IA en empresas?",
  "Cuéntame sobre casos de éxito",
  "¿Qué es análisis predictivo?",
  "¿Cómo empezar un proyecto?"
]

export default function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col justify-start py-4">
      <div className="max-w-md mx-auto text-center space-y-3 px-4">
        {/* Icono decorativo más pequeño */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#2FBF71]/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#2FBF71]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        {/* Texto guía compacto */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#0B2A3C]">
            ¡Hola! Soy el Consultor IA de zalantos
          </h3>
          <p className="text-xs text-[#6F7A83]">
            Prueba con alguna de estas preguntas:
          </p>
        </div>

        {/* Chips de sugerencias más compactos */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick(suggestion)}
              className="text-xs px-3 py-1 bg-white hover:bg-[#2FBF71]/10 border border-[#D7DFE6] hover:border-[#2FBF71]/50 rounded-full text-[#0B2A3C] transition-all hover:shadow-md hover:scale-105"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
