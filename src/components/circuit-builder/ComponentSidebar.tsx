import React from 'react';
import { 
  Battery, 
  Lightbulb, 
  Zap, 
  ToggleLeft, 
  Minus, 
  RotateCcw, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { CircuitComponentType } from '../../types/circuitBuilder';
import { CIRCUIT_PRESETS } from './presets';

interface ComponentSidebarProps {
  onAddComponent: (type: CircuitComponentType) => void;
  onLoadPreset: (presetId: string) => void;
  onClearCanvas: () => void;
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  onAddComponent,
  onLoadPreset,
  onClearCanvas,
}) => {
  const componentCatalog: {
    type: CircuitComponentType;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    badge: string;
  }[] = [
    {
      type: 'wire',
      name: 'Cable conductor',
      description: 'Conexión eléctrica de resistencia cero (0.00 Ω)',
      icon: <Minus className="w-6 h-6 stroke-[3] text-teal-600" />,
      color: 'bg-teal-50 text-teal-800',
      border: 'border-teal-200 hover:border-teal-400 hover:bg-teal-100/50',
      badge: 'Conector',
    },
    {
      type: 'battery',
      name: 'Batería (Fuente DC)',
      description: 'Fuente de fuerza electromotriz (1.5V - 24V)',
      icon: <Battery className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 text-amber-800',
      border: 'border-amber-200 hover:border-amber-400 hover:bg-amber-100/50',
      badge: '12 V',
    },
    {
      type: 'bulb',
      name: 'Bombilla incandescente',
      description: 'Carga que emite luz y calor al circular corriente',
      icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 text-yellow-800',
      border: 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100/50',
      badge: '25 Ω',
    },
    {
      type: 'resistor',
      name: 'Resistencia fija',
      description: 'Opone resistencia al paso de electrones (Ley de Ohm)',
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-800',
      border: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/50',
      badge: '100 Ω',
    },
    {
      type: 'switch',
      name: 'Interruptor de cuchilla',
      description: 'Abre o cierra el paso de corriente eléctrica con un clic',
      icon: <ToggleLeft className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-800',
      border: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100/50',
      badge: 'ON / OFF',
    },
  ];

  return (
    <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col gap-5 shadow-2xs">
      {/* Título de la caja de herramientas */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
            Caja de Herramientas
          </span>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            5 Elementos
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Componentes Interactivos
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Haz clic en cualquier elemento para añadirlo a la mesa de trabajo.
        </p>
      </div>

      {/* Lista de Componentes */}
      <div className="space-y-2">
        {componentCatalog.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddComponent(item.type)}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 group cursor-pointer active:scale-[0.98] ${item.border}`}
          >
            <div className={`p-2.5 rounded-xl ${item.color} shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Presets Rápidos */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-700">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>Circuitos Preconfigurados</span>
        </div>
        <div className="space-y-1.5">
          {CIRCUIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-teal-50/70 border border-slate-200/60 hover:border-teal-300 text-xs text-slate-700 hover:text-teal-900 transition-all font-medium flex items-center justify-between group"
            >
              <span className="truncate">{preset.name}</span>
              <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-teal-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Acciones de la mesa */}
      <div className="border-t border-slate-100 pt-4 space-y-2 mt-auto">
        <button
          onClick={onClearCanvas}
          className="w-full py-2 px-3 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-200/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar Mesa de Trabajo</span>
        </button>

        {/* Guía rápida de uso */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>¿Cómo conectar?</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-0.5">
            <li>Acerca los bornes circulares para unirlos con snap.</li>
            <li>O arrastra desde un borne a otro para tender un cable.</li>
            <li>Haz clic en el interruptor para abrirlo o cerrarlo.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
