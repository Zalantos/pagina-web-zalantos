import { LEAD_REGISTER_URL, CHAT_API_URL, CONSENT_VERSION } from './constants'
import { getOrCreateSessionId, saveLeadContext } from './zalantosSession'
import type {
  ConsentData,
  RegisterLeadResponse,
  ChatMessageResponse,
  ErrorMapping,
  FetchResponse,
  NormalizedPayload,
  UnknownApiPayload,
  ChatMessagePayload,
} from '@/types'

// =============================================================================
// ERRORES PERSONALIZADOS
// =============================================================================

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public detail?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// =============================================================================
// HELPERS DE NORMALIZACIÓN Y REQUEST
// =============================================================================

/**
 * Normaliza respuestas que pueden venir como array o con wrappers
 * n8n a veces devuelve [{ ok:true, output:"..." }] en vez de objeto plano
 */
export function normalizeApiPayload(payload: UnknownApiPayload): NormalizedPayload {
  if (!payload) return null

  let normalized = payload

  // Si es array, usar el primer elemento
  if (Array.isArray(normalized)) {
    if (normalized.length === 0) return null
    normalized = normalized[0]
  }

  // Si tiene { body } o { data } como wrapper, extraer
  if (normalized && typeof normalized === 'object') {
    const obj = normalized as Record<string, unknown>
    if (obj.body && typeof obj.body === 'object') {
      normalized = obj.body
    } else if (obj.data && typeof obj.data === 'object') {
      normalized = obj.data
    }
  }

  return normalized as NormalizedPayload
}

/**
 * Helper para hacer POST con JSON, timeout y manejo de errores
 */
export async function postJson<T = unknown>(
  url: string,
  body: Record<string, unknown>,
  timeoutMs: number = 20000
): Promise<FetchResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseText = await response.text()
    let data: T

    // Parsear JSON de forma segura
    try {
      data = responseText ? JSON.parse(responseText) as T : null as T
    } catch {
      throw new ApiError(
        'bad_response',
        'Respuesta inválida del servidor',
        response.status,
        responseText.substring(0, 200)
      )
    }

    return { status: response.status, data }
  } catch (error) {
    clearTimeout(timeoutId)

    // Timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'network_error',
        'Tiempo de espera agotado. Verifica tu conexión.',
        0,
        'timeout'
      )
    }

    // Network error
    if (error instanceof TypeError) {
      throw new ApiError(
        'network_error',
        'No se pudo conectar al servidor. Verifica tu conexión.',
        0,
        error.message
      )
    }

    // Re-lanzar si ya es ApiError
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError('unknown_error', 'Error desconocido', 0)
  }
}

// =============================================================================
// MAPPER DE CÓDIGOS DE ERROR A ACCIONES UI
// =============================================================================

/**
 * Mapea códigos de error del backend a acciones UI específicas
 */
export function getErrorMapping(
  code: string,
  status?: number,
  backendMessage?: string,
  detail?: string
): ErrorMapping {
  // registration_required (403) - abrir modal automáticamente
  if (code === 'registration_required' || (status === 403 && backendMessage?.includes('registration'))) {
    return {
      userMessage: 'Debes registrarte para continuar',
      action: 'modal',
      shouldOpenModal: true,
    }
  }

  // out_of_scope (422) - renderizar como mensaje del asistente
  if (code === 'out_of_scope' || (status === 422 && backendMessage?.toLowerCase().includes('scope'))) {
    return {
      userMessage: '', // No se usa
      action: 'assistant_message',
      shouldRenderAsAssistant: true,
      assistantMessage:
        backendMessage ||
        'Este consultor está limitado a IA, automatización, datos y eficiencia para negocios (zalantos). ¿En qué puedo ayudarte dentro de estos temas?',
    }
  }

  // blocked_content (403) - renderizar como mensaje del asistente
  if (code === 'blocked_content' || (status === 403 && backendMessage?.toLowerCase().includes('blocked'))) {
    return {
      userMessage: '', // No se usa
      action: 'assistant_message',
      shouldRenderAsAssistant: true,
      assistantMessage:
        'No puedo ayudar con eso. Si quieres, describe un objetivo de negocio u operación y te ayudo con automatización o IA.',
    }
  }

  // rate_limited (429)
  if (code === 'rate_limited' || status === 429) {
    return {
      userMessage: 'Demasiados mensajes. Espera 30 segundos e intenta nuevamente.',
      action: 'rate_limit',
    }
  }

  // invalid_request (400)
  if (code === 'invalid_request' || status === 400) {
    const msg = detail || backendMessage || 'Revisa tu mensaje o campos e intenta nuevamente'
    return {
      userMessage: msg,
      action: 'inline',
    }
  }

  // consent_required (400)
  if (code === 'consent_required' || backendMessage?.toLowerCase().includes('consent')) {
    return {
      userMessage: 'Debes aceptar la política de privacidad para continuar',
      action: 'inline',
    }
  }

  // unauthorized (401)
  if (code === 'unauthorized' || status === 401) {
    return {
      userMessage: 'Servicio temporalmente no disponible',
      action: 'banner',
    }
  }

  // server_misconfig / 5xx
  if (code === 'server_misconfig' || (status && status >= 500)) {
    return {
      userMessage: 'Servicio temporalmente no disponible. Intenta más tarde.',
      action: 'banner',
    }
  }

  // network_error
  if (code === 'network_error') {
    return {
      userMessage: 'Problema de conexión. Verifica tu red e intenta nuevamente.',
      action: 'inline',
    }
  }

  // bad_response
  if (code === 'bad_response') {
    console.error('[API] bad_response - detail:', detail)
    return {
      userMessage: 'Respuesta inválida del servidor',
      action: 'banner',
    }
  }

  // default
  return {
    userMessage: backendMessage || 'Error inesperado. Intenta nuevamente.',
    action: 'inline',
  }
}

// =============================================================================
// REGISTRO DE LEADS
// =============================================================================

/**
 * Registra un nuevo lead en el sistema con manejo completo de errores
 */
export async function registerLead(payload: {
  first_name: string
  last_name: string
  email: string
  page: string
  message?: string
}): Promise<{ ok: boolean; session_id: string; lead_id: string; lead_session_id: string }> {
  const session_id = getOrCreateSessionId()

  const consent: ConsentData = {
    privacy: true,
    consent_version: CONSENT_VERSION,
    consented_at: new Date().toISOString(),
  }

  const body = {
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    page: payload.page,
    // Solo el formulario de Contacto envía mensaje; el registro del Consultor IA no lo incluye
    ...(payload.message ? { message: payload.message } : {}),
    session_id,
    consent,
  }

  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'

  if (isDev) {
    console.log('[API] Registrando lead:', {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      page: payload.page,
    })
  }

  try {
    // Usar helper postJson con timeout
    const { status, data: rawData } = await postJson(LEAD_REGISTER_URL, body, 20000)

    if (isDev) {
      console.log('[API] Respuesta registro (raw):', rawData)
    }

    // Normalizar payload (puede venir como array)
    const normalized = normalizeApiPayload(rawData)

    if (!normalized || typeof normalized !== 'object') {
      console.error('[API] Payload normalizado inválido:', normalized)
      throw new ApiError('bad_response', 'Respuesta inválida del servidor', status, JSON.stringify(rawData))
    }

    const data = normalized as unknown as RegisterLeadResponse

    // Manejar errores del backend
    if (data.ok === false || status >= 400) {
      const errorCode = data.error || 'registration_failed'
      const errorMsg = data.message || data.error || 'Error al registrar'
      throw new ApiError(errorCode, errorMsg, status)
    }

    // Validar campos requeridos en respuesta exitosa
    if (!data.lead_id || typeof data.lead_id !== 'string' || data.lead_id.trim() === '') {
      console.error('[API] lead_id faltante o inválido:', data)
      throw new ApiError('bad_response', 'Respuesta incompleta (lead_id)', status, JSON.stringify(data))
    }

    if (!data.lead_session_id || typeof data.lead_session_id !== 'string' || data.lead_session_id.trim() === '') {
      console.error('[API] lead_session_id faltante o inválido:', data)
      throw new ApiError('bad_response', 'Respuesta incompleta (lead_session_id)', status, JSON.stringify(data))
    }

    const finalSessionId = data.session_id && typeof data.session_id === 'string' ? data.session_id : session_id

    console.log('[API] Registro exitoso:', {
      lead_id: data.lead_id,
      lead_session_id: data.lead_session_id,
      session_id: finalSessionId,
    })

    // Guardar contexto en localStorage
    saveLeadContext({
      session_id: finalSessionId,
      lead_id: data.lead_id,
      lead_session_id: data.lead_session_id,
      consent,
    })

    return {
      ok: true,
      session_id: finalSessionId,
      lead_id: data.lead_id,
      lead_session_id: data.lead_session_id,
    }
  } catch (error) {
    console.error('[API] Error en registro:', error)

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError('unknown_error', 'Error desconocido al registrar')
  }
}

// =============================================================================
// CHAT
// =============================================================================

/**
 * Envía un mensaje al chat con manejo completo de errores
 * IMPORTANTE: out_of_scope y blocked_content NO lanzan error,
 * retornan un objeto especial para renderizar como mensaje del asistente
 */
export async function sendChatMessage(payload: ChatMessagePayload): Promise<ChatMessageResponse> {
  console.log('[API] Enviando mensaje al chat:', {
    session_id: payload.session_id,
    lead_session_id: payload.lead_session_id,
    page: payload.page,
    message_length: payload.message.length,
  })

  try {
    const { status, data: rawData } = await postJson(
      CHAT_API_URL,
      {
        message: payload.message,
        session_id: payload.session_id,
        lead_session_id: payload.lead_session_id,
        page: payload.page,
        consent: payload.consent,
      },
      120000 // 2 minutos de timeout para respuestas del agente
    )

    console.log('[API] Respuesta chat (raw):', { status, rawData })

    // Normalizar payload
    const normalized = normalizeApiPayload(rawData)

    if (!normalized || typeof normalized !== 'object') {
      console.error('[API] Payload chat normalizado inválido:', normalized)
      throw new ApiError('bad_response', 'Respuesta inválida del servidor', status, JSON.stringify(rawData))
    }

    const data = normalized as unknown as ChatMessageResponse

    // Casos especiales: out_of_scope y blocked_content
    // Se manejan como "mensajes del asistente" y NO como errores
    const errorCode = data.error || ''

    if (errorCode === 'out_of_scope' || (status === 422 && data.message?.toLowerCase().includes('scope'))) {
      const msg =
        data.message ||
        'Este consultor está limitado a IA, automatización, datos y eficiencia para negocios (zalantos). ¿En qué puedo ayudarte dentro de estos temas?'
      
      // Retornar como respuesta válida con un flag especial
      return {
        ok: true,
        output: msg,
        response: msg,
        _handled_as_assistant: true,
      } as ChatMessageResponse
    }

    if (errorCode === 'blocked_content' || (status === 403 && data.message?.toLowerCase().includes('blocked'))) {
      const msg =
        data.message ||
        'No puedo ayudar con eso. Si quieres, describe un objetivo de negocio u operación y te ayudo con automatización o IA.'
      
      return {
        ok: true,
        output: msg,
        response: msg,
        _handled_as_assistant: true,
      } as ChatMessageResponse
    }

    // Errores que sí son errores (lanzar ApiError)
    if (data.ok === false || status >= 400) {
      const code = errorCode || 'chat_failed'
      const msg = data.message || data.error || 'Error al enviar mensaje'
      throw new ApiError(code, msg, status)
    }

    // Validar que haya output o response en éxito
    if (!data.output && !data.response) {
      console.error('[API] Respuesta exitosa sin output ni response:', data)
      throw new ApiError('bad_response', 'Respuesta sin contenido', status, JSON.stringify(data))
    }

    return data
  } catch (error) {
    console.error('[API] Error en chat:', error)

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError('unknown_error', 'Error desconocido al enviar mensaje')
  }
}
