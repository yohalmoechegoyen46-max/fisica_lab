import React, { useState, useMemo } from 'react';
import { 
  PlacedComponent, 
  CircuitWire, 
  CurrentFlowMode, 
  CircuitComponentType,
  ValueZoomScale
} from '../../types/circuitBuilder';
import { solveCircuit } from '../../utils/circuitEngine';
import { ComponentSidebar } from './ComponentSidebar';
import { TopToolbar } from './TopToolbar';
import { CanvasWorkspace } from './CanvasWorkspace';
import { CircuitStatusFooter } from './CircuitStatusFooter';
import { CIRCUIT_PRESETS } from './presets';

export const CircuitBuilderView: React.FC = () => {
  // Cargar preset inicial: Circuito Básico con Bombilla
  const initialPreset = CIRCUIT_PRESETS[0];

  const [components, setComponents] = useState<PlacedComponent[]>(initialPreset.components);
  const [wires, setWires] = useState<CircuitWire[]>(initialPreset.wires);

  // Configuración de visualización y lupa
  const [flowMode, setFlowMode] = useState<CurrentFlowMode>('electrons');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showValues, setShowValues] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [valueScale, setValueScale] = useState<ValueZoomScale>('large');
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);

  // Instrumentos virtuales
  const [isVoltmeterActive, setIsVoltmeterActive] = useState<boolean>(false);
  const [isAmmeterActive, setIsAmmeterActive] = useState<boolean>(false);

  // Posiciones de los instrumentos
  const [voltmeterPos, setVoltmeterPos] = useState<{ x: number; y: number }>({ x: 740, y: 40 });
  const [redProbe, setRedProbe] = useState<{ x: number; y: number }>({ x: 680, y: 220 });
  const [blackProbe, setBlackProbe] = useState<{ x: number; y: number }>({ x: 720, y: 220 });

  const [ammeterPos, setAmmeterPos] = useState<{ x: number; y: number }>({ x: 740, y: 220 });

  // Motor de física eléctrica en tiempo real
  const simulation = useMemo(() => {
    return solveCircuit(components, wires);
  }, [components, wires]);

  // Manejador para agregar nuevos componentes
  const handleAddComponent = (type: CircuitComponentType) => {
    const id = `${type}-${Date.now()}`;
    const nextCount = components.filter(c => c.type === type).length + 1;

    let defaultValue = 12;
    let defaultLabel = `Batería ${nextCount}`;

    if (type === 'battery') {
      defaultValue = 12;
      defaultLabel = `Batería ${nextCount} (12V)`;
    } else if (type === 'resistor') {
      defaultValue = 100;
      defaultLabel = `R${nextCount} (100Ω)`;
    } else if (type === 'bulb') {
      defaultValue = 25;
      defaultLabel = `Lámpara ${nextCount} (25Ω)`;
    } else if (type === 'switch') {
      defaultValue = 0;
      defaultLabel = `Interruptor ${nextCount}`;
    } else if (type === 'wire') {
      defaultValue = 0;
      defaultLabel = `Cable ${nextCount}`;
    }

    // Colocar en el centro disponible con ligero desplazamiento aleatorio
    const offsetX = (components.length % 5) * 20;
    const offsetY = (components.length % 5) * 15;

    const newComponent: PlacedComponent = {
      id,
      type,
      x: 350 + offsetX,
      y: 250 + offsetY,
      rotation: type === 'bulb' || type === 'battery' ? 90 : 0,
      value: defaultValue,
      isOpen: type === 'switch' ? false : undefined,
      label: defaultLabel,
    };

    setComponents(prev => [...prev, newComponent]);
  };

  // Manejador para actualizar componentes existentes
  const handleUpdateComponent = (id: string, updates: Partial<PlacedComponent>) => {
    setComponents(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Manejador para eliminar un componente
  const handleRemoveComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    // Eliminar también cables conectados a ese componente
    setWires(prev => prev.filter(w => !w.fromTerminalId.startsWith(id) && !w.toTerminalId.startsWith(id)));
  };

  // Conectar nuevo cable
  const handleAddWire = (fromTerminalId: string, toTerminalId: string) => {
    // Evitar cables duplicados entre los mismos terminales
    const exists = wires.some(
      w =>
        (w.fromTerminalId === fromTerminalId && w.toTerminalId === toTerminalId) ||
        (w.fromTerminalId === toTerminalId && w.toTerminalId === fromTerminalId)
    );
    if (exists) return;

    const newWire: CircuitWire = {
      id: `w-${Date.now()}`,
      fromTerminalId,
      toTerminalId,
    };
    setWires(prev => [...prev, newWire]);
  };

  // Eliminar un cable
  const handleRemoveWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  // Alternar estado de interruptor (abierto / cerrado)
  const handleToggleSwitch = (componentId: string) => {
    setComponents(prev =>
      prev.map(c => (c.id === componentId ? { ...c, isOpen: !c.isOpen } : c))
    );
  };

  // Cargar preset
  const handleLoadPreset = (presetId: string) => {
    const preset = CIRCUIT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setComponents(preset.components);
    setWires(preset.wires);
  };

  // Limpiar todo el lienzo
  const handleClearCanvas = () => {
    setComponents([]);
    setWires([]);
  };

  // Restablecer posición de sondas e instrumentos
  const handleResetProbes = () => {
    setVoltmeterPos({ x: 740, y: 40 });
    setRedProbe({ x: 680, y: 220 });
    setBlackProbe({ x: 720, y: 220 });
    setAmmeterPos({ x: 740, y: 220 });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Barra superior de herramientas y controles */}
      <TopToolbar
        flowMode={flowMode}
        setFlowMode={setFlowMode}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showValues={showValues}
        setShowValues={setShowValues}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        valueScale={valueScale}
        setValueScale={setValueScale}
        isMagnifierActive={isMagnifierActive}
        setIsMagnifierActive={setIsMagnifierActive}
        isVoltmeterActive={isVoltmeterActive}
        setIsVoltmeterActive={setIsVoltmeterActive}
        isAmmeterActive={isAmmeterActive}
        setIsAmmeterActive={setIsAmmeterActive}
        onResetProbes={handleResetProbes}
      />

      {/* Área Principal: Barra lateral de componentes + Mesa de trabajo */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Panel lateral izquierdo de componentes */}
        <ComponentSidebar
          onAddComponent={handleAddComponent}
          onLoadPreset={handleLoadPreset}
          onClearCanvas={handleClearCanvas}
        />

        {/* Mesa de trabajo / Lienzo interactivo y panel de magnitudes debajo de la cuadrícula */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          <CanvasWorkspace
            components={components}
            wires={wires}
            simulation={simulation}
            flowMode={flowMode}
            showLabels={showLabels}
            showValues={showValues}
            showGrid={showGrid}
            valueScale={valueScale}
            isMagnifierActive={isMagnifierActive}
            setIsMagnifierActive={setIsMagnifierActive}
            isVoltmeterActive={isVoltmeterActive}
            setIsVoltmeterActive={setIsVoltmeterActive}
            isAmmeterActive={isAmmeterActive}
            setIsAmmeterActive={setIsAmmeterActive}
            onUpdateComponent={handleUpdateComponent}
            onRemoveComponent={handleRemoveComponent}
            onAddWire={handleAddWire}
            onRemoveWire={handleRemoveWire}
            onToggleSwitch={handleToggleSwitch}
            redProbe={redProbe}
            setRedProbe={setRedProbe}
            blackProbe={blackProbe}
            setBlackProbe={setBlackProbe}
            voltmeterPos={voltmeterPos}
            setVoltmeterPos={setVoltmeterPos}
            ammeterPos={ammeterPos}
            setAmmeterPos={setAmmeterPos}
          />

          {/* Motor de física y panel de telemetría directamente debajo de la cuadrícula */}
          <CircuitStatusFooter simulation={simulation} />
        </div>
      </div>
    </div>
  );
};
