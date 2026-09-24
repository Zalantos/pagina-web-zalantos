
interface OnboardingPanelProps {
  onExampleClick: (example: string) => void
}

const EXAMPLE_QUESTIONS = [
  "¿Cómo puede ayudarme la IA en mi negocio?",
  "¿Qué servicios de análisis de datos ofrecen?",
  "Quiero implementar IA en mi empresa",
  "¿Cuál es el proceso de trabajo con zalantos?",
  "¿Tienen casos de éxito documentados?"
]

export default function OnboardingPanel({ onExampleClick }: OnboardingPanelProps) {
  return (
    <div
      className="space-y-6 h-full flex flex-col overflow-hidden"
      style={{ minHeight: '70vh', maxHeight: '85vh' }}
    >
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Cómo funciona */}
        <div className="bg-white rounded-2xl border border-[#D7DFE6] shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#0B2A3C] mb-4 flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-[#2FBF71]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Cómo funciona
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FBF71] flex items-center justify-center text-[#0B2A3C] text-xs font-bold">
              1
            </div>
            <div className="flex-1 text-sm text-[#6F7A83]">
              <strong className="text-[#0B2A3C]">Escribe tu consulta</strong> sobre automatización de procesos, IA o análisis de datos
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FBF71] flex items-center justify-center text-[#0B2A3C] text-xs font-bold">
              2
            </div>
            <div className="flex-1 text-sm text-[#6F7A83]">
              <strong className="text-[#0B2A3C]">Recibe respuestas inmediatas</strong> personalizadas con información detallada
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FBF71] flex items-center justify-center text-[#0B2A3C] text-xs font-bold">
              3
            </div>
            <div className="flex-1 text-sm text-[#6F7A83]">
              <strong className="text-[#0B2A3C]">Profundiza tu consulta</strong> con preguntas de seguimiento cuando lo necesites
            </div>
          </li>
        </ul>
        </div>

        {/* Ejemplos rápidos */}
        <div className="bg-white rounded-2xl border border-[#D7DFE6] shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#0B2A3C] mb-4 flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-[#2FBF71]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
          Ejemplos rápidos
        </h3>
        <p className="text-sm text-[#6F7A83] mb-3">
          Haz clic en cualquier pregunta para comenzar:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((question, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick(question)}
              className="text-left text-xs sm:text-sm px-3 py-2 bg-[#2FBF71]/10 hover:bg-[#2FBF71]/20 border border-[#2FBF71]/30 rounded-lg text-[#0B2A3C] transition-all hover:shadow-md hover:scale-[1.02]"
            >
              {question}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-[#2FBF71]/10 rounded-2xl border border-[#2FBF71]/30 p-4 flex-shrink-0 mt-auto">
        <div className="flex items-start gap-3">
          <svg 
            className="w-5 h-5 text-[#2FBF71] flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-[#0B2A3C] font-medium mb-1">
              Tus datos están protegidos
            </p>
            <p className="text-xs text-[#6F7A83]">
              No compartimos información con terceros.{' '}
              <a
                href="/privacy/"
                className="text-[#1F7F4A] hover:text-[#0B2A3C] underline font-medium"
              >
                Ver política de privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
