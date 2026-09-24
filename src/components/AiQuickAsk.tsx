'use client'

import React, { useState } from 'react'

const MAX_LENGTH = 1200
const PREFILL_KEY = 'zalantos:consultor-ia:prefill'
const CONSULTOR_URL = '/consultor-ia/'

/**
 * Campo de consulta rápida: guarda el texto en sessionStorage (no en la URL, para no
 * exponer datos del usuario en logs ni analítica) y abre el Consultor IA con el input precargado.
 */
export default function AiQuickAsk(): React.ReactElement {
  const [query, setQuery] = useState('')

  const submit = (): void => {
    const text = query.trim().slice(0, MAX_LENGTH)
    if (!text) return
    try {
      sessionStorage.setItem(PREFILL_KEY, text)
    } catch {
      // Sin sessionStorage el usuario llega al chat con el input vacío
    }
    window.location.assign(CONSULTOR_URL)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="w-full max-w-2xl mx-auto"
    >
      <label htmlFor="ai-quick-ask" className="sr-only">
        Cuéntale tu problema al Consultor IA
      </label>
      <div className="flex items-end gap-2 rounded-2xl bg-white border border-[#D7DFE6] shadow-[0_2px_6px_rgba(0,0,0,0.08)] p-2 focus-within:ring-2 focus-within:ring-[#1F7F4A]/40 transition">
        <textarea
          id="ai-quick-ask"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          maxLength={MAX_LENGTH}
          rows={2}
          placeholder="Cuéntale tu problema a la IA…"
          className="flex-1 resize-none bg-transparent px-3 py-2 text-[#0B2A3C] placeholder:text-[#6F7A83] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          aria-label="Consultar con IA"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#1F7F4A] text-white font-medium hover:bg-[#0B2A3C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7F4A] focus-visible:ring-offset-2"
        >
          <span className="hidden sm:inline">Consultar</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  )
}
