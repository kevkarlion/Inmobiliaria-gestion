"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
  Loader2, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  MessageCircle,
  Mail,
  Phone,
  Send
} from "lucide-react";
import { generateWhatsAppUrl, DEFAULT_WHATSAPP } from "@/lib/whatsappMessage";

// Types for form data
interface TasacionFormData {
  step1: {
    name: string;
    email: string;
    phone: string;
    contactPreference: "email" | "whatsapp" | "phone";
  };
  step2: {
    city: string;
    neighborhood: string;
    address: string;
  };
  step3: {
    propertyType: string;
    propertyState: string;
  };
  step4: {
    surfaceCovered: string;
    surfaceTotal: string;
    rooms: string;
    bathrooms: string;
    garage: string;
  };
  step5: {
    reason: string;
    timeline: string;
  };
  step6: {
    notes: string;
  };
}

// Initial form state
const initialFormData: TasacionFormData = {
  step1: { name: "", email: "", phone: "", contactPreference: "whatsapp" },
  step2: { city: "General Roca", neighborhood: "", address: "" },
  step3: { propertyType: "", propertyState: "" },
  step4: { surfaceCovered: "", surfaceTotal: "", rooms: "", bathrooms: "", garage: "" },
  step5: { reason: "", timeline: "" },
  step6: { notes: "" },
};

// Property types
const propertyTypes = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local comercial" },
  { value: "campo", label: "Campo/Chacra" },
];

// Property states
const propertyStates = [
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "a_reciclar", label: "A reciclar" },
];

// Reasons
const reasons = [
  { value: "vender", label: "Vender" },
  { value: "comprar", label: "Comprar" },
  { value: "refinancing", label: "Refinanciación" },
  { value: "sucesion", label: "Sucesión/herencia" },
  { value: "otro", label: "Otro" },
];

// Timelines
const timelines = [
  { value: "inmediata", label: "Inmediata (menos de 3 meses)" },
  { value: "3_6_meses", label: "3-6 meses" },
  { value: "6_12_meses", label: "6-12 meses" },
  { value: "sin_urgencia", label: "Sin urgencia" },
];

const steps = [
  { id: 1, title: "Contacto", subtitle: "Tus datos" },
  { id: 2, title: "Ubicación", subtitle: "Dónde está" },
  { id: 3, title: "Tipo", subtitle: "Qué es" },
  { id: 4, title: "Detalles", subtitle: "Características" },
  { id: 5, title: "Objetivo", subtitle: "Para qué" },
  { id: 6, title: "Extras", subtitle: "Más info" },
];

export default function TasacionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TasacionFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Update form data
  const updateFormData = useCallback((step: keyof TasacionFormData, data: Partial<TasacionFormData[keyof TasacionFormData]>) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
    // Clear errors for this step
    const stepErrors = Object.keys(data);
    setErrors(prev => {
      const newErrors = { ...prev };
      stepErrors.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.step1.name || formData.step1.name.trim().length < 2) {
        newErrors.name = "El nombre es requerido (mínimo 2 caracteres)";
      }
      if (!formData.step1.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.step1.email)) {
        newErrors.email = "Ingresa un email válido";
      }
      if (!formData.step1.phone || formData.step1.phone.replace(/\s/g, "").length < 10) {
        newErrors.phone = "Ingresa un teléfono válido (mínimo 10 dígitos)";
      }
    }

    if (step === 2) {
      if (!formData.step2.city) {
        newErrors.city = "La ciudad es requerida";
      }
    }

    if (step === 3) {
      if (!formData.step3.propertyType) {
        newErrors.propertyType = "Selecciona el tipo de propiedad";
      }
      if (!formData.step3.propertyState) {
        newErrors.propertyState = "Selecciona el estado";
      }
    }

    if (step === 5) {
      if (!formData.step5.reason) {
        newErrors.reason = "Selecciona un motivo";
      }
      if (!formData.step5.timeline) {
        newErrors.timeline = "Selecciona un plazo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Honeypot field (hidden from users)
          website_url: "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("¡Gracias! Tu solicitud ha sido recibida.");
      } else {
        toast.error(data.error || "Hubo un problema al enviar");
      }
    } catch {
      toast.error("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Get WhatsApp URL for contact
  const getWhatsAppUrl = () => {
    return generateWhatsAppUrl(
      DEFAULT_WHATSAPP,
      formData.step1.name || "Cliente",
      formData.step3.propertyType || "propiedad",
      formData.step2.city,
      formData.step2.neighborhood || undefined
    );
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 lg:space-y-5">
            <div className="text-center mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                Tus datos de contacto
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                ¿Cómo podemos comunicarnos contigo?
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.step1.name}
                  onChange={e => updateFormData("step1", { name: e.target.value })}
                  className={`w-full px-3 lg:px-3 py-2 lg:py-2 border-2 rounded-sm transition-colors text-sm ${
                    errors.name 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-gold-sand"
                  }`}
                  placeholder="Juan Pérez"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.step1.email}
                  onChange={e => updateFormData("step1", { email: e.target.value })}
                  className={`w-full px-3 lg:px-3 py-2 lg:py-2 border-2 rounded-sm transition-colors text-sm ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-gold-sand"
                  }`}
                  placeholder="juan@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.step1.phone}
                  onChange={e => updateFormData("step1", { phone: e.target.value })}
                  className={`w-full px-3 lg:px-3 py-2 lg:py-2 border-2 rounded-sm transition-colors text-sm ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-gold-sand"
                  }`}
                  placeholder="298 4582082"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                ¿Dónde está la propiedad?
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                La ubicación ayuda a una tasación más precisa
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.step2.city}
                  onChange={e => updateFormData("step2", { city: e.target.value })}
                  className={`w-full px-3 lg:px-3 py-2 lg:py-2 border-2 rounded-sm text-sm transition-colors ${
                    errors.city 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-gold-sand"
                  }`}
                  placeholder="General Roca"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Barrio / Zona
                </label>
                <input
                  type="text"
                  value={formData.step2.neighborhood}
                  onChange={e => updateFormData("step2", { neighborhood: e.target.value })}
                  className="w-full px-3 lg:px-3 py-2 lg:py-2 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="Ej: Barrio Norte (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.step2.address}
                  onChange={e => updateFormData("step2", { address: e.target.value })}
                  className="w-full px-3 lg:px-3 py-2 lg:py-2 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="Ej: Avenida Roca 1234"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                ¿Qué tipo de propiedad es?
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                Seleccioná el tipo y estado
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Tipo de propiedad *
                </label>
                <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                  {propertyTypes.map(type => {
                    const isSelected = formData.step3.propertyType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateFormData("step3", { propertyType: type.value })}
                        className={`py-2 lg:py-2 px-2 lg:px-2 border-2 rounded-sm text-xs font-bold transition-all ${
                          isSelected
                            ? "border-gold-sand bg-gold-sand/10 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Estado *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {propertyStates.map(state => {
                    const isSelected = formData.step3.propertyState === state.value;
                    return (
                      <button
                        key={state.value}
                        type="button"
                        onClick={() => updateFormData("step3", { propertyState: state.value })}
                        className={`py-2 lg:py-2 px-2 lg:px-2 border-2 rounded-sm text-xs font-bold transition-all ${
                          isSelected
                            ? "border-gold-sand bg-gold-sand/10 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {state.label}
                      </button>
                    );
                  })}
                </div>
                {errors.propertyState && <p className="text-red-500 text-xs mt-1">{errors.propertyState}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                Características
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                Metros y ambientes
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Sup. cubierta (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.step4.surfaceCovered}
                  onChange={e => updateFormData("step4", { surfaceCovered: e.target.value })}
                  className="w-full px-3 lg:px-2 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="0"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Sup. total (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.step4.surfaceTotal}
                  onChange={e => updateFormData("step4", { surfaceTotal: e.target.value })}
                  className="w-full px-3 lg:px-2 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Ambientes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.step4.rooms}
                  onChange={e => updateFormData("step4", { rooms: e.target.value })}
                  className="w-full px-3 lg:px-2 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="1-10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.step4.bathrooms}
                  onChange={e => updateFormData("step4", { bathrooms: e.target.value })}
                  className="w-full px-3 lg:px-2 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                  placeholder="1-5"
                />
              </div>
            </div>

            <div className="lg:max-w-xs">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                Cocheras
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={formData.step4.garage}
                onChange={e => updateFormData("step4", { garage: e.target.value })}
                className="w-full px-3 lg:px-2 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors"
                placeholder="0-3"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                ¿Para qué necesitás la tasación?
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                Esto nos ayuda a darte una respuesta más precisa
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Motivo *
                </label>
                <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                  {reasons.map(reason => {
                    const isSelected = formData.step5.reason === reason.value;
                    return (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => updateFormData("step5", { reason: reason.value })}
                        className={`py-2 lg:py-2 px-2 lg:px-2 border-2 rounded-sm text-xs font-bold transition-all ${
                          isSelected
                            ? "border-gold-sand bg-gold-sand/10 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {reason.label}
                      </button>
                    );
                  })}
                </div>
                {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                  Plazo *
                </label>
                <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                  {timelines.map(timeline => {
                    const isSelected = formData.step5.timeline === timeline.value;
                    return (
                      <button
                        key={timeline.value}
                        type="button"
                        onClick={() => updateFormData("step5", { timeline: timeline.value })}
                        className={`py-2 lg:py-2 px-2 lg:px-2 border-2 rounded-sm text-xs font-bold transition-all ${
                          isSelected
                            ? "border-gold-sand bg-gold-sand/10 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {timeline.label}
                      </button>
                    );
                  })}
                </div>
                {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-3 lg:space-y-4">
            <div className="text-center mb-3 lg:mb-4">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">
                Información adicional
              </h3>
              <p className="text-slate-500 mt-1 text-sm font-lora italic">
                ¿Algo más que debamos saber?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.step6.notes}
                onChange={e => updateFormData("step6", { notes: e.target.value })}
                className="w-full px-3 lg:px-3 py-2 lg:py-1.5 border-2 border-slate-200 focus:border-gold-sand rounded-sm text-sm transition-colors resize-none"
                rows={3}
                placeholder="Comentarios adicionales..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 lg:mb-1 uppercase tracking-wide">
                ¿Cómo preferís que te contactemos?
              </label>
              <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
                {[
                  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                  { value: "email", label: "Email", icon: Mail },
                  { value: "phone", label: "Teléfono", icon: Phone },
                ].map(option => {
                  const Icon = option.icon;
                  const isSelected = formData.step1.contactPreference === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFormData("step1", { contactPreference: option.value as "email" | "whatsapp" | "phone" })}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border-2 rounded-sm text-xs font-bold transition-all ${
                        isSelected
                          ? "border-gold-sand bg-gold-sand/10 text-slate-900"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={14} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Success state - keep same container structure to avoid scroll jump
  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-slate-900 px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
              <Check size={16} className="text-white" />
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-green-400 font-bold text-xs uppercase tracking-wider">
              Solicitud enviada
            </span>
          </div>
        </div>
        <div className="p-5 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
            ¡Solicitud recibida!
          </h3>
          <p className="text-slate-600 text-sm mb-6">
            Gracias {formData.step1.name}. Te contactaremos en breve.
          </p>
          
          {formData.step1.contactPreference === "whatsapp" && (
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 px-5 rounded-sm transition-all"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          )}

          <div className="mt-6">
            <Link href="/" className="text-gold-sand text-xs font-bold hover:underline">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress bar */}
      <div className="bg-slate-900 px-4 py-3">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep > step.id
                    ? "bg-gold-sand text-slate-900"
                    : currentStep === step.id
                    ? "bg-white text-slate-900 ring-2 ring-gold-sand"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentStep > step.id ? <Check size={14} /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`hidden sm:block w-8 h-0.5 mx-1 rounded ${
                    currentStep > step.id ? "bg-gold-sand" : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <span className="text-gold-sand font-bold text-xs uppercase tracking-wider">
            Paso {currentStep} de 6
          </span>
        </div>
      </div>

      {/* Form content */}
      <div className="p-5">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 lg:px-10 pb-8 flex justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-sm hover:border-slate-300 transition-all"
          >
            <ChevronLeft size={20} />
            Volver
          </button>
        ) : (
          <div />
        )}

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-slate-800 transition-all"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-sand text-slate-900 text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-gold-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={16} />
                Enviar solicitud
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
