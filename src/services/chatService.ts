// Servicio para comunicación con el Consultor IA (Cloudflare Worker)

import { CHAT_API_URL } from '@/lib/constants'

export interface ConsentData {
  privacy: boolean
  consent_version: string
  consented_at: string
}

export interface ChatMessageRequest {
  message: string
  session_id: string
  page: string
  consent: ConsentData
}

export interface ChatMessageResponse {
  response?: string
  output?: string
  session_id?: string
  ok?: boolean
  [key: string]: unknown
}

// También puede ser un array
export type ChatServiceResponse = ChatMessageResponse | Array<{ ok: boolean; output: string }>

// Clase de error personalizada para el servicio de chat
export class ChatServiceError extends Error {
  code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ChatServiceError'
    this.code = code
    
    // Mantener el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChatServiceError)
    }
  }
}

export class ChatService {
  /**
   * Envía un mensaje al Consultor IA
   */
  static async sendMessage(request: ChatMessageRequest): Promise<ChatServiceResponse> {
    console.log('[ChatService] Enviando mensaje a:', CHAT_API_URL)
    console.log('[ChatService] Payload:', {
      session_id: request.session_id,
      page: request.page,
      message_length: request.message.length,
      consent_version: request.consent.consent_version
    })

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NO se envían headers secretos desde el navegador
        },
        body: JSON.stringify({
          message: request.message,
          session_id: request.session_id,
          page: request.page,
          consent: request.consent
        }),
        // Timeout: el browser no soporta AbortSignal.timeout directamente en todos los navegadores
        // pero podemos usar un AbortController manual si es necesario
      })

      console.log('[ChatService] Response status:', response.status, response.statusText)

      // Manejo de errores HTTP específicos
      if (!response.ok) {
        const errorCode = response.status
        let errorMessage: string

        switch (errorCode) {
          case 429:
            errorMessage = 'Estás enviando demasiados mensajes. Intenta nuevamente en unos minutos.'
            break
          case 403:
            errorMessage = 'No puedo ayudar con ese contenido.'
            break
          case 400:
          case 401:
            errorMessage = 'No se pudo procesar tu solicitud. Revisa consentimiento e inténtalo de nuevo.'
            break
          default:
            errorMessage = 'Error inesperado. Intenta nuevamente.'
        }

        throw new ChatServiceError(errorCode, errorMessage)
      }

      // Parsear respuesta exitosa
      const data: ChatServiceResponse = await response.json()
      console.log('[ChatService] Response data:', data)
      return data

    } catch (error) {
      // Si ya es un ChatServiceError, re-lanzarlo
      if (error instanceof ChatServiceError) {
        throw error
      }

      // Log detallado del error original
      console.error('[ChatService] Error original:', error)
      console.error('[ChatService] Error type:', error?.constructor?.name)
      console.error('[ChatService] Error message:', error instanceof Error ? error.message : String(error))

      // Error de red o timeout
      if (error instanceof TypeError) {
        const errorMsg = error.message
        console.error('[ChatService] TypeError detectado:', errorMsg)
        
        // Mensajes más específicos según el tipo de TypeError
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
          throw new ChatServiceError(0, 'No se pudo conectar al servidor. Verifica tu conexión a internet o que el servicio esté disponible.')
        } else if (errorMsg.includes('CORS')) {
          throw new ChatServiceError(0, 'Error de configuración del servidor (CORS). Contacta al administrador.')
        } else {
          throw new ChatServiceError(0, `Error de conexión: ${errorMsg}`)
        }
      }

      // Error de parseo JSON
      if (error instanceof SyntaxError) {
        console.error('[ChatService] SyntaxError - respuesta no es JSON válido')
        throw new ChatServiceError(500, 'Error al procesar la respuesta del servidor.')
      }

      // Error genérico
      console.error('[ChatService] Unexpected error:', error)
      throw new ChatServiceError(500, 'Error inesperado. Intenta nuevamente.')
    }
  }

  /**
   * Valida que el request tenga todos los campos requeridos
   */
  static validateRequest(request: Partial<ChatMessageRequest>): { isValid: boolean; message?: string } {
    if (!request.message || !request.message.trim()) {
      return { isValid: false, message: 'El mensaje no puede estar vacío' }
    }

    if (request.message.length > 1200) {
      return { isValid: false, message: 'El mensaje no puede exceder 1200 caracteres' }
    }

    if (!request.session_id) {
      return { isValid: false, message: 'Falta el ID de sesión' }
    }

    if (!request.consent || !request.consent.privacy) {
      return { isValid: false, message: 'Se requiere consentimiento de privacidad' }
    }

    return { isValid: true }
  }
}
