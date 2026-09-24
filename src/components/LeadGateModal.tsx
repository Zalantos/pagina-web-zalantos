'use client'

import React, { useEffect, useState } from 'react'
import { registerLead, ApiError, getErrorMapping } from '@/lib/api'
import { getLeadContext } from '@/lib/zalantosSession'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  getFieldError,
  initialFieldErrors,
  type FieldErrors,
  type FieldName,
} from '@/lib/lead-form'

const ERROR_IDS: Record<FieldName, string> = {
  firstName: 'lead-first-name-error',
  lastName: 'lead-last-name-error',
  email: 'lead-email-error',
  privacy: 'lead-privacy-error',
}

interface LeadGateModalProps {
  pageUrl: string
  onReady: () => void
}

export default function LeadGateModal({ pageUrl, onReady }: LeadGateModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(initialFieldErrors)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const context = getLeadContext()

    if (context) {
      setIsRegistered(true)
      onReady()
    } else {
      setIsVisible(true)
    }
  }, [onReady])

  const validateForm = (): {
    errors: FieldErrors
    isValid: boolean
    invalidCount: number
  } => {
    const errors: FieldErrors = {
      firstName: getFieldError('firstName', firstName),
      lastName: getFieldError('lastName', lastName),
      email: getFieldError('email', email),
      privacy: getFieldError('privacy', consentAccepted),
    }

    const invalidCount = Object.values(errors).filter(Boolean).length

    return {
      errors,
      isValid: invalidCount === 0,
      invalidCount,
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return

    const validation = validateForm()
    setFieldErrors(validation.errors)

    if (!validation.isValid) {
      if (validation.invalidCount >= 2) {
        setGeneralError('Corrige los campos marcados para continuar')
      }
      return
    }

    setGeneralError(null)
    setIsLoading(true)

    try {
      await registerLead({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        page: pageUrl,
      })

      setFieldErrors(initialFieldErrors)
      setIsVisible(false)
      setIsRegistered(true)
      onReady()
    } catch (err) {
      console.error('Error en registro:', err)

      if (err instanceof ApiError) {
        const mapping = getErrorMapping(err.code, err.status, err.message, err.detail)

        if (err.code === 'consent_required') {
          setFieldErrors((prev) => ({
            ...prev,
            privacy: 'Debes aceptar la política para continuar',
          }))
        }

        setGeneralError(mapping.userMessage || 'Error al registrar. Intenta nuevamente.')
      } else if (err instanceof Error) {
        setGeneralError('Error inesperado: ' + err.message)
      } else {
        setGeneralError('Error inesperado. Por favor, intenta nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldUpdate = (field: FieldName, value: string | boolean) => {
    const updatedError = getFieldError(field, value)
    setFieldErrors((prev) => ({
      ...prev,
      [field]: updatedError,
    }))

    if (generalError) {
      setGeneralError(null)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    window.location.href = '/'
  }

  if (!isVisible && isRegistered) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-[#1F7F4A]/30 bg-white/90 shadow-2xl p-4">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#1F7F4A] flex items-center gap-2">
            <span className="text-base">✓</span>
            Ya estás registrado
          </p>
          <p className="text-xs text-[#3D5566]">
            Puedes continuar al chat sin volver a registrarte.
          </p>
        </div>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar registro y volver al inicio de zalantos"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DFE6] bg-white text-2xl font-light text-[#6F7A83] hover:border-[#D7DFE6] hover:text-[#3D5566] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A3C]"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FBF71]/10 rounded-full mb-4">
            <svg
              className="w-5 h-5 text-[#1F7F4A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium text-[#0B2A3C]">Registro Requerido</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0B2A3C] mb-2">Bienvenido al Consultor IA</h2>

          <p className="text-sm text-[#6F7A83]">
            Para acceder al chat, necesitamos algunos datos básicos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#0B2A3C] mb-1">
              Nombre <span className="text-[#D6455D]">*</span>
            </label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                handleFieldUpdate('firstName', e.target.value)
              }}
              placeholder="Juan"
              required
              ariaInvalid={Boolean(fieldErrors.firstName)}
              ariaDescribedBy={fieldErrors.firstName ? ERROR_IDS.firstName : undefined}
              className={`w-full ${fieldErrors.firstName ? 'ring-1 ring-[#D6455D] focus:ring-[#D6455D]' : ''}`}
            />
            {fieldErrors.firstName && (
              <p id={ERROR_IDS.firstName} className="mt-1 text-xs text-[#D6455D]">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#0B2A3C] mb-1">
              Apellido <span className="text-[#D6455D]">*</span>
            </label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                handleFieldUpdate('lastName', e.target.value)
              }}
              placeholder="Pérez"
              required
              ariaInvalid={Boolean(fieldErrors.lastName)}
              ariaDescribedBy={fieldErrors.lastName ? ERROR_IDS.lastName : undefined}
              className={`w-full ${fieldErrors.lastName ? 'ring-1 ring-[#D6455D] focus:ring-[#D6455D]' : ''}`}
            />
            {fieldErrors.lastName && (
              <p id={ERROR_IDS.lastName} className="mt-1 text-xs text-[#D6455D]">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#0B2A3C] mb-1">
              Email <span className="text-[#D6455D]">*</span>
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleFieldUpdate('email', e.target.value)
              }}
              placeholder="juan.perez@ejemplo.com"
              required
              ariaInvalid={Boolean(fieldErrors.email)}
              ariaDescribedBy={fieldErrors.email ? ERROR_IDS.email : undefined}
              className={`w-full ${fieldErrors.email ? 'ring-1 ring-[#D6455D] focus:ring-[#D6455D]' : ''}`}
            />
            {fieldErrors.email && (
              <p id={ERROR_IDS.email} className="mt-1 text-xs text-[#D6455D]">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#F1F5F9] rounded-lg">
            <input
              type="checkbox"
              id="consent"
              checked={consentAccepted}
              onChange={(e) => {
                setConsentAccepted(e.target.checked)
                handleFieldUpdate('privacy', e.target.checked)
              }}
              className="mt-1 h-4 w-4 accent-[#1F7F4A] border-[#D7DFE6] rounded focus:ring-[#0B2A3C]"
              aria-invalid={Boolean(fieldErrors.privacy)}
              aria-describedby={fieldErrors.privacy ? ERROR_IDS.privacy : undefined}
            />
            <label htmlFor="consent" className="text-sm text-[#6F7A83] flex-1">
              Acepto que zalantos almacene mis datos para mejorar la experiencia del chat y enviar comunicaciones relevantes. Puedes consultar nuestra política de privacidad en{' '}
              <a
                href="https://zalantos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1F7F4A] hover:text-[#0B2A3C] underline"
              >
                zalantos.com
              </a>
              .
            </label>
          </div>
          {fieldErrors.privacy && (
            <p id={ERROR_IDS.privacy} className="text-xs text-[#D6455D]">
              {fieldErrors.privacy}
            </p>
          )}

          {generalError && (
            <div
              className="p-3 bg-[#D6455D]/10 border border-[#D6455D]/30 rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-[#0B2A3C]">{generalError}</p>
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </Button>
        </form>

        <p className="text-xs text-center text-[#6F7A83] mt-4">
          Tus datos están protegidos y no serán compartidos con terceros.
        </p>
      </div>
    </div>
  )
}
