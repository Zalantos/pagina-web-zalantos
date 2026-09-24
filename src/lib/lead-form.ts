// Validación compartida por los formularios de lead (Consultor IA y Contacto)

export type FieldName = 'firstName' | 'lastName' | 'email' | 'privacy'
export type FieldErrors = Record<FieldName, string | null>

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const initialFieldErrors: FieldErrors = {
  firstName: null,
  lastName: null,
  email: null,
  privacy: null,
}

export function getFieldError(field: FieldName, value: string | boolean): string | null {
  if (field === 'firstName') {
    return typeof value === 'string' && value.trim() === '' ? 'Completa tu nombre' : null
  }

  if (field === 'lastName') {
    return typeof value === 'string' && value.trim() === '' ? 'Completa tu apellido' : null
  }

  if (field === 'email') {
    const emailValue = typeof value === 'string' ? value.trim() : ''
    if (emailValue === '') {
      return 'Ingresa tu correo'
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      return 'Ingresa un email válido (ej: nombre@empresa.com)'
    }
    return null
  }

  if (field === 'privacy') {
    return value === true ? null : 'Debes aceptar la política para continuar'
  }

  return null
}
