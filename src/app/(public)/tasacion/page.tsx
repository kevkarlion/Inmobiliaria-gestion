import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import TasacionHero from "@/components/shared/TasacionHero/TasacionHero";
import TasacionForm from "@/components/shared/TasacionForm/TasacionForm";

export const metadata: Metadata = {
  title: "Tasación de Propiedades en General Roca | Riquelme Propiedades",
  description:
    "Obtené la tasación más precisa de tu propiedad en General Roca. Respuesta en menos de 24 horas, sin compromiso. ¡Solicitá tu valuation gratuito ahora!",
  alternates: {
    canonical: getCanonicalUrl("/tasacion"),
  },
};

export default function TasacionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <TasacionHero />
      
      <section id="tasacion-form" className="py-10 lg:py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-montserrat text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Completa el formulario
            </h2>
            <p className="font-lora text-sm text-slate-600 italic">
              Te contactamos en menos de 24 horas
            </p>
          </div>
          
          <TasacionForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 lg:py-14 bg-slate-50">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-montserrat text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Preguntas frecuentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "¿Cuánto tiempo toma la tasación?",
                a: "Te contactamos dentro de las 24 horas hábiles con una estimación preliminar.",
              },
              {
                q: "¿Necesito estar presente para la tasación?",
                a: "No es necesario. Podés proporcionar los datos por teléfono o completando el formulario.",
              },
              {
                q: "¿Qué información necesito tener a mano?",
                a: "Es útil contar con la dirección, superficie aproximada, cantidad de ambientes y estado de la propiedad.",
              },
              {
                q: "¿La tasación tiene compromiso de venta?",
                a: "No, la tasación no te compromete a nada. Es simplemente una estimación del valor de mercado.",
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-lg shadow-sm border border-slate-200">
                <summary className="flex items-center justify-between cursor-pointer p-4 font-bold text-sm text-slate-900 list-none">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-8 bg-slate-900 text-center">
        <div className="max-w-lg mx-auto px-6">
          <p className="text-sm text-white/70 mb-4">¿Preferís contactarnos directamente?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/5492984582082"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-5 rounded-sm transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:info@riquelmeprop.com"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-5 rounded-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
