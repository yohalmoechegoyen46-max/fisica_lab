import { X, BookOpen, Compass, Zap, HelpCircle, FileText, Download } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Centro de Aprendizaje y Guía Teórica
              </h3>
              <p className="text-xs text-slate-500">Fundamentos físicos, fórmulas y uso del simulador</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Sección 1: Análisis Vectorial */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Compass className="w-4 h-4 text-teal-600" />
              <h4>1. Análisis Vectorial en el Plano</h4>
            </div>

            <p>
              Un vector en física representa una magnitud que posee módulo (longitud), dirección (ángulo respecto al eje de referencia) y sentido.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono">
                <span className="font-bold text-slate-800 font-sans block mb-1">Descomposición Rectangular</span>
                <div>Fx = F · cos(θ)</div>
                <div>Fy = F · sen(θ)</div>
                <span className="text-[11px] text-slate-400 font-sans block mt-1">
                  θ medido desde el semieje positivo +X en sentido antihorario.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono">
                <span className="font-bold text-slate-800 font-sans block mb-1">Fuerza Resultante</span>
                <div>ΣFx = F₁x + F₂x + ... + Fnx</div>
                <div>ΣFy = F₁y + F₂y + ... + Fny</div>
                <div>|R| = √(ΣFx² + ΣFy²)</div>
                <div>θR = atan2(ΣFy, ΣFx)</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200/60 text-teal-900">
              💡 <strong>Interacción en el plano:</strong> Puedes arrastrar con el cursor o el dedo la punta de cualquier vector directamente sobre el plano cartesiano para modificar en vivo su magnitud y orientación.
            </div>
          </div>

          {/* Sección 2: Ley de Ohm y Circuitos */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <h4>2. Ley de Ohm y Circuitos Eléctricos</h4>
            </div>

            <p>
              Establece la relación entre la diferencia de potencial (voltaje <strong>V</strong>), la corriente eléctrica (<strong>I</strong>) y la oposición al flujo de cargas (resistencia <strong>R</strong>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono">
                <span className="font-bold text-slate-800 font-sans block mb-1">Circuito en Serie</span>
                <div>Req = R₁ + R₂ + R₃</div>
                <div>I = constante en toda la malla</div>
                <div>Vtotal = V₁ + V₂ + V₃</div>
                <span className="text-[11px] text-slate-400 font-sans block mt-1">
                  La resistencia equivalente siempre es mayor que cualquiera de las individuales.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono">
                <span className="font-bold text-slate-800 font-sans block mb-1">Circuito en Paralelo</span>
                <div>1/Req = 1/R₁ + 1/R₂ + 1/R₃</div>
                <div>V = idéntico en cada rama</div>
                <div>Itotal = I₁ + I₂ + I₃</div>
                <span className="text-[11px] text-slate-400 font-sans block mt-1">
                  La resistencia equivalente siempre es menor que la menor de las resistencias.
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 font-mono text-rose-900">
              <span className="font-bold font-sans block mb-1">Potencia y Alertas de Sobrecarga (Pnom)</span>
              <div>P = V × I = I² × R = V² / R</div>
              <span className="text-[11px] font-sans block mt-1">
                Si la potencia disipada por un componente supera su potencia nominal admisible (P &gt; Pnom, 0,50 W en este laboratorio), el simulador emitirá una advertencia visual de sobrecalentamiento.
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 rounded-b-2xl">
          <a
            href="/MANUAL_DE_USUARIO_Y_TECNICO.md"
            download="MANUAL_DE_USUARIO_Y_TECNICO.md"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 text-teal-700 hover:text-teal-800 font-bold text-xs shadow-2xs transition-all w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Descargar Manual Completo (.md)</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all w-full sm:w-auto"
          >
            Entendido, volver a la simulación
          </button>
        </div>
      </div>
    </div>
  );
};
