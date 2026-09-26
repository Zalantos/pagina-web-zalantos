import { useEffect, useState } from 'react'
import ChatPanel from './ChatPanel'
import OnboardingPanel from './OnboardingPanel'
import LeadGateModal from '../LeadGateModal'
import { getLeadContext } from '../../lib/zalantosSession'

export default function ConsultorIAContent() {
  const [isReady, setIsReady] = useState(false)
  const [pageUrl, setPageUrl] = useState('')
  const [exampleToFill, setExampleToFill] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const context = getLeadContext()
    setIsReady(!!context)
    setPageUrl(window.location.href)

    // Consulta enviada desde el home (AiQuickAsk): se precarga en el input y se consume una sola vez
    try {
      const prefill = sessionStorage.getItem('zalantos:consultor-ia:prefill')
      if (prefill) {
        sessionStorage.removeItem('zalantos:consultor-ia:prefill')
        setExampleToFill(prefill)
      }
    } catch {
      // sessionStorage no disponible: el chat inicia vacío
    }
  }, [])

  const handleExampleClick = (example: string) => {
    setExampleToFill(example)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9]">
      <div className="h-16 md:h-20" />

      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="max-w-[1200px] mx-auto mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#2FBF71]/20 rounded-full w-fit mb-4">
            <svg
              className="w-5 h-5 text-[#2FBF71]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#0B2A3C]">
              Consultor IA · beta
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B2A3C] leading-tight">
              Consultor IA de zalantos
            </h1>
            <p className="text-base sm:text-lg text-[#6F7A83] max-w-[720px]">
              Resuelve tus dudas sobre análisis de datos, implementación de IA y transformación
              digital con un asistente que entiende tu contexto y responde con claridad.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[38%_1fr] gap-6 md:gap-8 items-stretch">
            <aside className="order-2 md:order-1">
              <OnboardingPanel onExampleClick={handleExampleClick} />
            </aside>

            <section
              className={`order-1 md:order-2 ${!isReady ? 'pointer-events-none opacity-60' : 'opacity-100'} transition-opacity duration-300`}
            >
              <ChatPanel
                isReady={isReady}
                onRegistrationRequired={() => setIsReady(false)}
                exampleToFill={exampleToFill}
              />
            </section>
          </div>
        </div>

        <LeadGateModal
          pageUrl={pageUrl}
          onReady={() => {
            setIsReady(true)
          }}
        />
      </div>
    </div>
  )
}
