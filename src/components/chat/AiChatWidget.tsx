'use client'

import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DOMPurify from 'dompurify'
import { sendChatMessage, ApiError, getErrorMapping } from '@/lib/api'
import { getLeadContext } from '@/lib/zalantosSession'
import type { Message, AiChatWidgetProps, RetryMessageData } from '@/types'
import ChatEmptyState from './ChatEmptyState'

// Constantes
const STORAGE_KEYS = {
  HISTORY: 'zalantos_ai_chat_history'
}

export default function AiChatWidget({ isReady, onRegistrationRequired, onExampleClick }: AiChatWidgetProps) {
  // Estado del chat
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [bannerError, setBannerError] = useState<string | null>(null)
  
  // Rate limiting
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const didHydrateRef = useRef(false)
  const previousMessageCountRef = useRef(0)

  // Efecto para llenar el input cuando se recibe un ejemplo desde el parent
  useEffect(() => {
    if (onExampleClick && isReady) {
      setInputMessage(onExampleClick)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [onExampleClick, isReady])

  // Efecto para los mensajes de carga
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    if (isLoading) {
      // 1-3 segundos
      setLoadingMessage('Enviando respuesta al agente')

      // 4-6 segundos
      timers.push(setTimeout(() => {
        setLoadingMessage('Verificando la seguridad del mensaje')
      }, 3000))

      // 7-12 segundos
      timers.push(setTimeout(() => {
        setLoadingMessage('Verificando la intención')
      }, 6000))

      // 13 en adelante
      timers.push(setTimeout(() => {
        setLoadingMessage('Pensando')
      }, 12000))
    }

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [isLoading])

  // Efecto para countdown de rate limiting
  useEffect(() => {
    if (!rateLimitedUntil) {
      setRateLimitCountdown(0)
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.ceil((rateLimitedUntil - now) / 1000)
      
      if (remaining <= 0) {
        setRateLimitedUntil(null)
        setRateLimitCountdown(0)
      } else {
        setRateLimitCountdown(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [rateLimitedUntil])


  // Cargar historial desde localStorage al montar
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY)
      if (historyStr) {
        try {
          const loadedMessages = JSON.parse(historyStr)
          setMessages(loadedMessages)
          previousMessageCountRef.current = loadedMessages.length
        } catch {
          // Historial corrupto, resetear
          localStorage.removeItem(STORAGE_KEYS.HISTORY)
        }
      }
      didHydrateRef.current = true
    } catch (error) {
      console.error('Error loading chat state:', error)
    }
  }, [])

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    // Solo guardar después de la hidratación inicial
    if (didHydrateRef.current && messages.length !== previousMessageCountRef.current) {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(messages))
        previousMessageCountRef.current = messages.length
      } catch (error) {
        console.error('Error saving chat history:', error)
      }
    }
  }, [messages])

  // Auto-scroll al fondo del contenedor del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isLoading])

  // Sanitizar contenido HTML
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    })
  }

  // Enviar mensaje con manejo completo de errores
  const handleSendMessage = async (e: React.FormEvent, retryPayload?: RetryMessageData) => {
    e.preventDefault()
    
    // Verificar rate limiting
    if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
      return
    }

    if (!retryPayload && (!inputMessage.trim() || isLoading || !isReady)) return

    // Obtener contexto del lead
    const leadContext = getLeadContext()
    
    if (!leadContext) {
      setError('Sesión expirada. Por favor, regístrate nuevamente.')
      onRegistrationRequired()
      return
    }

    // Si es retry, usar el payload guardado; si no, crear nuevo mensaje
    let userMessage: Message
    let messagePayload

    if (retryPayload) {
      // Retry: buscar el mensaje original y marcarlo como no-failed
      const msgIndex = messages.findIndex(m => m.id === retryPayload.messageId)
      if (msgIndex !== -1) {
        const updatedMessages = [...messages]
        updatedMessages[msgIndex] = { ...updatedMessages[msgIndex], failed: false }
        setMessages(updatedMessages)
        userMessage = updatedMessages[msgIndex]
      } else {
        return
      }
      messagePayload = retryPayload.payload
    } else {
      userMessage = {
        id: uuidv4(),
        role: 'user',
        content: inputMessage.trim(),
        timestamp: new Date().toISOString(),
        failed: false,
      }

      messagePayload = {
        message: userMessage.content,
        session_id: leadContext.session_id,
        lead_session_id: leadContext.lead_session_id,
        page: window.location.href,
        consent: leadContext.consent,
      }

      // Guardar payload en el mensaje para poder reintentar
      userMessage.originalPayload = messagePayload

      // Agregar mensaje del usuario
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
    }

    setIsLoading(true)
    setError(null)
    setBannerError(null)

    try {
      const data = await sendChatMessage(messagePayload)
      
      // Extraer el contenido de la respuesta
      let rawContent = ''
      
      if (data.response) {
        rawContent = data.response
      } else if (data.output) {
        rawContent = data.output
      } else {
        rawContent = JSON.stringify(data)
      }

      // Convertir saltos de línea \n a <br> y sanitizar
      const formattedContent = rawContent.replace(/\n/g, '<br>').trim()
      const botContent = sanitizeHtml(formattedContent)

      const botMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: botContent,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      
      if (error instanceof ApiError) {
        const mapping = getErrorMapping(error.code, error.status, error.message, error.detail)

        // registration_required: abrir modal
        if (mapping.shouldOpenModal) {
          setError('Se requiere registro para continuar')
          onRegistrationRequired()
          return
        }

        // rate_limited: activar contador 30s
        if (mapping.action === 'rate_limit') {
          setRateLimitedUntil(Date.now() + 30000)
          setBannerError(mapping.userMessage)
          return
        }

        // network_error: marcar mensaje como failed
        if (error.code === 'network_error') {
          setMessages(prev =>
            prev.map(m =>
              m.id === userMessage.id ? { ...m, failed: true } : m
            )
          )
          setError(mapping.userMessage)
          return
        }

        // Errores graves (401, 5xx): banner
        if (mapping.action === 'banner') {
          setBannerError(mapping.userMessage)
          return
        }

        // Otros: inline error
        setError(mapping.userMessage)
      } else if (error instanceof Error) {
        setError('Error inesperado: ' + error.message)
      } else {
        setError('Error inesperado. Intenta nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Reintentar mensaje fallido
  const handleRetryMessage = (messageId: string, payload: RetryMessageData['payload']) => {
    handleSendMessage({ preventDefault: () => {} } as React.FormEvent, {
      messageId,
      payload,
    })
  }

  // Manejar clic en sugerencia o ejemplo
  const handleSuggestionClick = (text: string) => {
    if (!isReady || isLoading) return
    setInputMessage(text)
    // Hacer foco en el input para que el usuario pueda editar o enviar
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Resetear chat
  const handleResetChat = () => {
    if (confirm('¿Estás seguro de que deseas resetear el chat? Se borrará todo el historial.')) {
      setMessages([])
      localStorage.removeItem(STORAGE_KEYS.HISTORY)
      setError(null)
    }
  }

  // Renderizar mensaje con soporte para retry
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    const hasFailed = message.failed === true
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className="flex flex-col items-end max-w-[80%]">
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? hasFailed
                  ? 'bg-[#D6455D]/15 border border-[#D6455D]/40 text-[#0B2A3C]'
                  : 'bg-[#2FBF71] text-[#0B2A3C]'
                : 'bg-[#E6ECF1] text-[#0B2A3C] border border-[#D7DFE6]'
            }`}
          >
            {isUser ? (
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.content}
              </p>
            ) : (
              <div 
                className="text-sm sm:text-base prose prose-sm max-w-none [&>br]:block [&>br]:my-2"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            )}
            <p className={`text-xs mt-2 ${isUser ? (hasFailed ? 'text-[#6F7A83]' : 'text-[#0B2A3C]/70') : 'text-[#6F7A83]'}`}>
              {new Date(message.timestamp).toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          {/* Botón de reintentar si falló */}
          {hasFailed && message.originalPayload && (
            <button
              onClick={() => handleRetryMessage(message.id, message.originalPayload!)}
              className="mt-2 text-xs text-[#1F7F4A] hover:text-[#0B2A3C] underline flex items-center gap-1"
              disabled={isLoading}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar (Beta)
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Banner de rate limiting */}
      {rateLimitedUntil && rateLimitCountdown > 0 && (
        <div className="mb-3 p-3 bg-[#D9A441]/10 border border-[#D9A441]/50 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-[#D9A441] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs font-medium text-[#0B2A3C]">
              Demasiados mensajes. Podrás enviar nuevamente en {rateLimitCountdown}s
            </p>
          </div>
        </div>
      )}

      {/* Banner de errores graves */}
      {bannerError && (
        <div className="mb-3 p-3 bg-[#D6455D]/10 border border-[#D6455D]/40 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-[#D6455D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-[#0B2A3C]">{bannerError}</p>
          </div>
          <button
            onClick={() => setBannerError(null)}
            className="text-[#D6455D] hover:text-[#0B2A3C]"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Panel de chat con scroll */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-3 bg-[#F1F5F9] rounded-xl p-3"
      >
        {messages.length === 0 ? (
          <ChatEmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          <>
            {messages.map(renderMessage)}
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-[#E6ECF1] border border-[#D7DFE6] rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#2FBF71] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-[#2FBF71] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-[#2FBF71] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm text-[#3D5566] animate-pulse">{loadingMessage}...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error inline */}
      {error && (
        <div className="mb-3 p-2 bg-[#D6455D]/10 border border-[#D6455D]/30 rounded-lg">
          <p className="text-xs text-[#0B2A3C]">{error}</p>
        </div>
      )}

      {/* Input sticky abajo */}
      <div className="flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
            disabled={!isReady || isLoading || (rateLimitedUntil !== null && Date.now() < rateLimitedUntil)}
            placeholder={
              rateLimitedUntil && Date.now() < rateLimitedUntil
                ? `Espera ${rateLimitCountdown}s...`
                : isReady
                ? "Escribe tu mensaje..."
                : "Completa el registro para comenzar"
            }
            className="flex-1 px-4 py-3 border border-[#D7DFE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2FBF71] focus:border-transparent resize-none disabled:bg-[#E6ECF1] disabled:cursor-not-allowed text-sm"
            rows={2}
            maxLength={1200}
          />
          <button
            type="submit"
            disabled={
              !isReady ||
              !inputMessage.trim() ||
              isLoading ||
              (rateLimitedUntil !== null && Date.now() < rateLimitedUntil)
            }
            className="px-5 py-3 bg-[#2FBF71] text-[#0B2A3C] rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 text-sm"
          >
            {rateLimitedUntil && Date.now() < rateLimitedUntil ? `${rateLimitCountdown}s` : 'Enviar'}
          </button>
        </form>

        {/* Reset button */}
        {messages.length > 0 && (
          <button
            onClick={handleResetChat}
            className="mt-2 text-xs text-[#6F7A83] hover:text-[#3D5566] underline"
          >
            Resetear chat
          </button>
        )}
      </div>
    </div>
  )
}

