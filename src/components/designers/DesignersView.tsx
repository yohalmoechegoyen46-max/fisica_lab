import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Edit3, 
  Mail, 
  BookOpen, 
  Award, 
  Building2,
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Save, 
  X, 
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Designer } from '../../types';

const INITIAL_DESIGNERS: Designer[] = [
  {
    id: 'd1',
    name: 'Rodrigo Echegoyen',
    career: 'Técnico en Ingeniería de Desarrollo de Software',
    studentId: '197925',
    institutionalEmail: 'rodrigo.echegoyen@FísicaLab.edu',
    personalEmail: 'rodrigo.dev@gmail.com',
    avatarUrl: '',
    role: 'Líder Técnico & Arquitecto Frontend',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
  {
    id: 'd2',
    name: 'Sofia Morales',
    career: 'Ingeniería en Ciencias de la Computación',
    studentId: '198210',
    institutionalEmail: 'sofia.morales@FísicaLab.edu',
    personalEmail: 'sofia.morales99@gmail.com',
    avatarUrl: '',
    role: 'Especialista en Simulación Física y Canvas',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
  {
    id: 'd3',
    name: 'Carlos Mendoza',
    career: 'Ingeniería Electrónica y Automatización',
    studentId: '197540',
    institutionalEmail: 'carlos.mendoza@FísicaLab.edu',
    personalEmail: 'carlos.mendoza.elec@gmail.com',
    avatarUrl: '',
    role: 'Diseñador de Circuitos y Leyes de Ohm',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
  {
    id: 'd4',
    name: 'Daniela Rivas',
    career: 'Licenciatura en Diseño Gráfico Interactivo',
    studentId: '199012',
    institutionalEmail: 'daniela.rivas@FísicaLab.edu',
    personalEmail: 'daniv.design@gmail.com',
    avatarUrl: '',
    role: 'Directora de UI/UX y Sistema de Diseño',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
  {
    id: 'd5',
    name: 'Alejandro Torres',
    career: 'Ingeniería en Sistemas y Redes',
    studentId: '197888',
    institutionalEmail: 'alejandro.torres@FísicaLab.edu',
    personalEmail: 'alejandro.torres.dev@gmail.com',
    avatarUrl: '',
    role: 'Desarrollador Full-Stack y Módulos SI',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
  {
    id: 'd6',
    name: 'Lucia Gomez',
    career: 'Técnico en Ingeniería de Desarrollo de Software',
    studentId: '198450',
    institutionalEmail: 'lucia.gomez@FísicaLab.edu',
    personalEmail: 'lucia.gomez.Dev@gmail.com',
    avatarUrl: '',
    role: 'Control de Calidad y Pruebas Unitarias',
    institution: 'ITCA FEPADE Zacatecoluca',
  },
];

export const DesignersView: React.FC = () => {
  const [designers, setDesigners] = useState<Designer[]>(() => {
    const saved = localStorage.getItem('fisica_lab_designers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure institution property exists for legacy local storage items
        return parsed.map((d: any) => ({
          ...d,
          institution: d.institution || 'ITCA FEPADE Zacatecoluca'
        }));
      } catch {
        return INITIAL_DESIGNERS;
      }
    }
    return INITIAL_DESIGNERS;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [editingDesigner, setEditingDesigner] = useState<Designer | null>(null);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    localStorage.setItem('fisica_lab_designers', JSON.stringify(designers));
  }, [designers]);

  // Rotación automática de la presentación (cada 4.5 segundos)
  useEffect(() => {
    if (!isPlaying || editingDesigner) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % designers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, designers.length, editingDesigner]);

  const activeDesigner = designers[currentIndex] || designers[0];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesigner) return;
    setDesigners(prev => prev.map(d => d.id === editingDesigner.id ? editingDesigner : d));
    setEditingDesigner(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDesigner) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingDesigner({ ...editingDesigner, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {/* Banner Superior Oscuro con Estilo del Diseño */}
      <div className="bg-[#0c1527] text-white py-14 px-6 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Las personas detrás del proyecto</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Conoce a nuestros <span className="text-teal-400">diseñadores</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Un equipo multidisciplinario que transforma principios científicos en experiencias claras, visuales e interactivas.
          </p>
        </div>
      </div>

      {/* Control de presentación interactiva */}
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span>PRESENTACIÓN INTERACTIVA ({currentIndex + 1} DE {designers.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-teal-600" /> : <Play className="w-3.5 h-3.5 text-teal-600" />}
            <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex((prev) => (prev - 1 + designers.length) % designers.length);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex((prev) => (prev + 1) % designers.length);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: DISEÑADOR DESTACADO (PRESENTACIÓN ROTATIVA) */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Tarjeta Destacada Estilo Imagen */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-500">
          {/* Lado Izquierdo: Avatar / Tarjeta Oscura */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1527] to-[#122340] p-8 flex flex-col items-center justify-center relative text-white min-h-[320px]">
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Integrante 0{currentIndex + 1}
              </span>
            </div>

            {/* Avatar Cuadrado Redondeado */}
            <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-4xl shadow-2xl shadow-teal-500/30 overflow-hidden relative group border-2 border-teal-300/40">
              {activeDesigner.avatarUrl ? (
                <img src={activeDesigner.avatarUrl} alt={activeDesigner.name} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(activeDesigner.name)}</span>
              )}
            </div>

            <div className="mt-6 text-center space-y-1">
              <span className="text-xs text-teal-300 font-semibold tracking-wide block">
                {activeDesigner.role}
              </span>
              <span className="text-[11px] text-slate-300 font-medium tracking-wide flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3 text-teal-400" />
                {activeDesigner.institution}
              </span>
            </div>
          </div>

          {/* Lado Derecho: Detalles y edición */}
          <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
                    Diseñador Destacado
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeDesigner.name}
                  </h2>
                </div>

                <button
                  onClick={() => setEditingDesigner(activeDesigner)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-all shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar perfil</span>
                </button>
              </div>

              {/* Información Carrera, Institución y Carnet */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carrera</span>
                    <span className="text-xs md:text-sm font-bold text-slate-800">{activeDesigner.career}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institución</span>
                      <span className="text-xs font-bold text-slate-800 truncate block">{activeDesigner.institution}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Número de Carnet</span>
                      <span className="text-xs font-bold text-slate-800 font-mono truncate block">{activeDesigner.studentId}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institucional</span>
                      <span className="text-xs font-medium text-slate-700 truncate block font-mono">{activeDesigner.institutionalEmail}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cyan-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Personal</span>
                      <span className="text-xs font-medium text-slate-700 truncate block font-mono">{activeDesigner.personalEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Puntos de paginación */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">Rotación automática activa</span>
              <div className="flex items-center gap-1.5">
                {designers.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-teal-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    title={d.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: TODOS LOS INTEGRANTES (GRID DE 6 DISEÑADORES) */}
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase block">
              Nuestro equipo
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Todos los integrantes
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            {designers.length} diseñadores · 1 proyecto
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer, idx) => (
            <div
              key={designer.id}
              onClick={() => {
                setCurrentIndex(idx);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group cursor-pointer rounded-2xl bg-white border p-6 space-y-4 transition-all duration-300 hover:shadow-xl hover:border-teal-400 flex flex-col justify-between ${
                idx === currentIndex ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shrink-0 overflow-hidden">
                  {designer.avatarUrl ? (
                    <img src={designer.avatarUrl} alt={designer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(designer.name)}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-teal-600 tracking-wider uppercase block">
                    Integrante 0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                    {designer.name}
                  </h3>
                  <span className="text-xs text-slate-500 block truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-teal-600" />
                    {designer.institution}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {designer.career}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                <span>Ver presentación &rarr;</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDesigner(designer);
                  }}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Editar perfil"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {editingDesigner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Editar Perfil de Diseñador</h3>
                  <p className="text-xs text-slate-500">Actualiza la información académica y de contacto</p>
                </div>
              </div>

              <button
                onClick={() => setEditingDesigner(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-2xl overflow-hidden shadow-md">
                  {editingDesigner.avatarUrl ? (
                    <img src={editingDesigner.avatarUrl} alt={editingDesigner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(editingDesigner.name)}</span>
                  )}
                </div>

                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                  <span>Subir foto de perfil</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={editingDesigner.name}
                  onChange={(e) => setEditingDesigner({ ...editingDesigner, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Carrera</label>
                <input
                  type="text"
                  required
                  value={editingDesigner.career}
                  onChange={(e) => setEditingDesigner({ ...editingDesigner, career: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Institución</label>
                <input
                  type="text"
                  required
                  value={editingDesigner.institution}
                  onChange={(e) => setEditingDesigner({ ...editingDesigner, institution: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Número de Carnet</label>
                  <input
                    type="text"
                    required
                    value={editingDesigner.studentId}
                    onChange={(e) => setEditingDesigner({ ...editingDesigner, studentId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Rol / Especialidad</label>
                  <input
                    type="text"
                    value={editingDesigner.role}
                    onChange={(e) => setEditingDesigner({ ...editingDesigner, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Correo institucional</label>
                <input
                  type="email"
                  required
                  value={editingDesigner.institutionalEmail}
                  onChange={(e) => setEditingDesigner({ ...editingDesigner, institutionalEmail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Correo personal</label>
                <input
                  type="email"
                  required
                  value={editingDesigner.personalEmail}
                  onChange={(e) => setEditingDesigner({ ...editingDesigner, personalEmail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDesigner(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
