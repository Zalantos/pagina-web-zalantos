"use client";

import React, { useEffect, useRef, useState } from "react";
import { registerLead, ApiError, getErrorMapping } from "@/lib/api";
import Button from "@/components/ui/Button";
import {
  getFieldError,
  initialFieldErrors,
  type FieldErrors,
  type FieldName,
} from "@/lib/lead-form";

const MESSAGE_MAX_LENGTH = 1000;

const ERROR_IDS: Record<FieldName, string> = {
  firstName: "contact-first-name-error",
  lastName: "contact-last-name-error",
  email: "contact-email-error",
  privacy: "contact-privacy-error",
};

const CALENDLY_URL =
  "https://calendly.com/tomas-rodriguez-zalantos/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=1f7f4a";
const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

interface CalendlyWindow extends Window {
  Calendly?: {
    initInlineWidget: (options: {
      url: string;
      parentElement: HTMLElement;
    }) => void;
  };
}

function fieldClass(hasError: boolean): string {
  return `w-full px-5 py-4 min-h-[56px] rounded-md bg-[#EEEEEE] text-[#0B2A3C] placeholder:text-[#6F7A83] shadow-[0_2px_6px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-2 transition ${
    hasError
      ? "ring-1 ring-[#D6455D] focus:ring-[#D6455D]"
      : "focus:ring-[#1F7F4A]/40"
  }`;
}

/**
 * Widget de Calendly embebido en la sección de agenda.
 */
function CalendlyEmbed(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = (): void => {
      const calendly = (window as CalendlyWindow).Calendly;
      if (calendly && container.childElementCount === 0) {
        calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: container,
        });
      }
    };

    if ((window as CalendlyWindow).Calendly) {
      init();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_SCRIPT}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => script?.removeEventListener("load", init);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#D7DFE6] overflow-hidden">
      <div
        ref={containerRef}
        className="w-full"
        style={{ minWidth: 320, height: 700 }}
      />
    </div>
  );
}

export default function ContactPanel(): React.ReactElement {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>(initialFieldErrors);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Los CTAs "Agenda tu Sprint" llegan con ?agendar=1 y llevan al calendario (útil en móvil, donde queda bajo el formulario)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("agendar") === "1") {
      document
        .getElementById("agenda")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleFieldUpdate = (
    field: FieldName,
    value: string | boolean,
  ): void => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field, value),
    }));
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (isLoading) return;

    const errors: FieldErrors = {
      firstName: getFieldError("firstName", firstName),
      lastName: getFieldError("lastName", lastName),
      email: getFieldError("email", email),
      privacy: getFieldError("privacy", consentAccepted),
    };
    setFieldErrors(errors);

    const invalidCount = Object.values(errors).filter(Boolean).length;
    if (invalidCount > 0) {
      if (invalidCount >= 2)
        setGeneralError("Corrige los campos marcados para continuar");
      return;
    }

    setGeneralError(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      await registerLead({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: cleanEmail,
        message: message.trim() || undefined,
        page: window.location.href,
      });
      setSentTo(cleanEmail);
    } catch (err) {
      if (err instanceof ApiError) {
        const mapping = getErrorMapping(
          err.code,
          err.status,
          err.message,
          err.detail,
        );
        if (err.code === "consent_required") {
          setFieldErrors((prev) => ({
            ...prev,
            privacy: "Debes aceptar la política para continuar",
          }));
        }
        setGeneralError(
          mapping.userMessage ||
            "No pudimos enviar tu mensaje. Intenta nuevamente.",
        );
      } else {
        setGeneralError("No pudimos enviar tu mensaje. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0B2A3C] mb-6">
          Envíanos un mensaje
        </h2>
        {sentTo ? (
          <div role="status" aria-live="polite" className="space-y-3 py-6">
            <h3 className="font-display text-2xl font-bold text-[#0B2A3C]">
              Recibimos tu mensaje
            </h3>
            <p className="text-[#3D5566]">
              Gracias, {firstName.trim()}. Te escribiremos a{" "}
              <span className="font-semibold text-[#0B2A3C]">{sentTo}</span>. Si
              prefieres avanzar ahora, puedes agendar una reunión en el
              calendario.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-firstName" className="sr-only">
                  Nombre
                </label>
                <input
                  id="contact-firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    handleFieldUpdate("firstName", e.target.value);
                  }}
                  placeholder="Nombre"
                  required
                  aria-invalid={fieldErrors.firstName ? "true" : undefined}
                  aria-describedby={
                    fieldErrors.firstName ? ERROR_IDS.firstName : undefined
                  }
                  className={fieldClass(Boolean(fieldErrors.firstName))}
                />
                {fieldErrors.firstName && (
                  <p
                    id={ERROR_IDS.firstName}
                    className="mt-1 text-xs text-[#D6455D]"
                  >
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-lastName" className="sr-only">
                  Apellido
                </label>
                <input
                  id="contact-lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    handleFieldUpdate("lastName", e.target.value);
                  }}
                  placeholder="Apellido"
                  required
                  aria-invalid={fieldErrors.lastName ? "true" : undefined}
                  aria-describedby={
                    fieldErrors.lastName ? ERROR_IDS.lastName : undefined
                  }
                  className={fieldClass(Boolean(fieldErrors.lastName))}
                />
                {fieldErrors.lastName && (
                  <p
                    id={ERROR_IDS.lastName}
                    className="mt-1 text-xs text-[#D6455D]"
                  >
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleFieldUpdate("email", e.target.value);
                }}
                placeholder="Correo electrónico"
                required
                aria-invalid={fieldErrors.email ? "true" : undefined}
                aria-describedby={
                  fieldErrors.email ? ERROR_IDS.email : undefined
                }
                className={fieldClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email && (
                <p id={ERROR_IDS.email} className="mt-1 text-xs text-[#D6455D]">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-message" className="sr-only">
                Mensaje (opcional)
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MESSAGE_MAX_LENGTH}
                rows={7}
                placeholder="Mensaje: empresa, proceso afectado y qué esperas lograr"
                className={`${fieldClass(false)} resize-y`}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="contact-consent"
                checked={consentAccepted}
                onChange={(e) => {
                  setConsentAccepted(e.target.checked);
                  handleFieldUpdate("privacy", e.target.checked);
                }}
                className="mt-1 h-4 w-4 accent-[#1F7F4A] border-[#D7DFE6] rounded focus:ring-[#0B2A3C]"
                aria-invalid={Boolean(fieldErrors.privacy)}
                aria-describedby={
                  fieldErrors.privacy ? ERROR_IDS.privacy : undefined
                }
              />
              <label
                htmlFor="contact-consent"
                className="text-sm text-[#3D5566] flex-1"
              >
                Acepto que zalantos almacene mis datos para responder mi
                solicitud y enviar comunicaciones relevantes. Más información en
                nuestra{" "}
                <a
                  href="/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F7F4A] hover:text-[#0B2A3C] underline"
                >
                  política de privacidad
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

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full sm:w-auto rounded-full px-10 uppercase tracking-wide"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div id="agenda" className="scroll-mt-28">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0B2A3C] mb-6">
          Agenda tu Sprint
        </h2>
        <CalendlyEmbed />
      </div>
    </div>
  );
}
