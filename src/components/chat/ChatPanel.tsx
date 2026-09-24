'use client'

import AiChatWidget from './AiChatWidget'

interface ChatPanelProps {
  isReady: boolean
  onRegistrationRequired: () => void
  exampleToFill?: string | null
}

export default function ChatPanel({ isReady, onRegistrationRequired, exampleToFill }: ChatPanelProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#D7DFE6] shadow-lg overflow-hidden flex flex-col h-full"
      style={{ minHeight: '70vh', maxHeight: '85vh' }}
    >
      {/* Header del chat */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#D7DFE6] bg-[#2FBF71]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2FBF71] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B2A3C]">Consultor IA</h2>
              <p className="text-xs text-[#6F7A83]">Respuestas en tiempo real</p>
            </div>
          </div>
          <span className="rounded-full bg-[#2FBF71]/20 px-3 py-1 text-xs font-semibold text-[#1F7F4A]">
            Beta
          </span>
        </div>
      </div>

      {/* Área del chat - crece para llenar espacio disponible */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4 sm:p-6">
          <AiChatWidget
            isReady={isReady}
            onRegistrationRequired={onRegistrationRequired}
            onExampleClick={exampleToFill}
          />
        </div>
      </div>
    </div>
  )
}
