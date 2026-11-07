# MANUAL DE USUARIO Y DOCUMENTACIÓN TÉCNICA
## FísicaLab — Simulador de Física General y Circuitos Eléctricos

---

### **Información del Proyecto**
* **Institución:** ITCA FEPADE Zacatecoluca
* **Plataforma:** Laboratorio Virtual Interactivo de Física y Electrónica
* **Versión:** 2.0.0
* **Fecha de Emisión:** Noviembre 2026

---

## TABLA DE CONTENIDOS
1. [Introducción y Objetivos Didácticos](#1-introducción-y-objetivos-didácticos)
2. [Guía de Usuario por Módulos](#2-guía-de-usuario-por-módulos)
   - 2.1 [Pantalla Principal (Inicio)](#21-pantalla-principal-inicio)
   - 2.2 [Módulo de Análisis Vectorial](#22-módulo-de-análisis-vectorial)
   - 2.3 [Módulo de Ley de Ohm y Circuitos](#23-módulo-de-ley-de-ohm-y-circuitos)
     - 2.3.1 [Construcción de Circuitos (Laboratorio Interactivo)](#231-construcción-de-circuitos-laboratorio-interactivo)
     - 2.3.2 [Calculadora y Criterios de Diseño (Serie, Paralelo y Mixto)](#232-calculadora-y-criterios-de-diseño-serie-paralelo-y-mixto)
   - 2.4 [Módulo de Diseñadores / Perfil de Autores](#24-módulo-de-diseñadores--perfil-de-autores)
3. [Fundamentos Físicos y Formulación Matemática](#3-fundamentos-físicos-y-formulación-matemática)
   - 3.1 [Descomposición y Suma de Vectores](#31-descomposición-y-suma-de-vectores)
   - 3.2 [Leyes de Kirchhoff y Ley de Ohm](#32-leyes-de-kirchhoff-y-ley-de-ohm)
   - 3.3 [Modelado Analítico de Circuitos Serie, Paralelo y Mixto](#33-modelado-analítico-de-circuitos-serie-paralelo-y-mixto)
   - 3.4 [Criterios de Potencia (Efecto Joule) y Sobrecarga Térmica](#34-criterios-de-potencia-efecto-joule-y-sobrecarga-térmica)
4. [Documentación Técnica de Implementación](#4-documentación-técnica-de-implementación)
   - 4.1 [Estructura del Proyecto y Árbol de Archivos](#41-estructura-del-proyecto-y-árbol-de-archivos)
   - 4.2 [Motor de Física Eléctrica MNA (Modified Nodal Analysis)](#42-motor-de-física-eléctrica-mna-modified-nodal-analysis)
   - 4.3 [Resolución de Sistemas Lineales por Eliminación Gaussiana](#43-resolución-de-sistemas-lineales-por-eliminación-gaussiana)
   - 4.4 [Optimizaciones de Renderizado SVG y Manejo de Eventos](#44-optimizaciones-de-renderizado-svg-y-manejo-de-eventos)
5. [Preguntas Frecuentes y Solución de Problemas](#5-preguntas-frecuentes-y-solución-de-problemas)

---

## 1. INTRODUCCIÓN Y OBJETIVOS DIDÁCTICOS

**FísicaLab** es una aplicación web interactiva diseñada para la enseñanza, comprobación y experimentación en física general y circuitos eléctricos de corriente continua (DC).

### Objetivos Clave:
1. **Comprobación Experimental:** Permitir al estudiante armar esquemas libres de circuitos y verificar el comportamiento de voltajes, intensidades y potencias en tiempo real.
2. **Puente Teórico-Práctico:** Contrastar los cálculos analíticos paso a paso con las mediciones directas obtenidas mediante voltímetros y amperímetros virtuales.
3. **Comprensión Gráfica y Espacial:** Visualizar vectores de fuerza concurrentes en el plano cartesiano y su resultante con actualización geométrica inmediata.

---

## 2. GUÍA DE USUARIO POR MÓDULOS

### 2.1 Pantalla Principal (Inicio)
Al ingresar a la plataforma, se presenta el panel de bienvenida con accesos directos a los dos motores principales:
* **Módulo Vectorial:** Para estática y suma de fuerzas concurrentes.
* **Módulo de Circuitos:** Para la Ley de Ohm, cálculo de mallas y construcción interactiva.
* **Barra Lateral:** Permite alternar rápidamente entre módulos, acceder al centro de ayuda y consultar las fichas de los autores.

---

### 2.2 Módulo de Análisis Vectorial
Ubicación: Menú lateral > **Análisis Vectorial**

#### Subpestaña: Plano Cartesiano
* **Interacción:** El usuario puede agregar fuerzas vectoriales definiendo su magnitud en Newtons ($N$) y su ángulo en grados sexagesimales ($\theta \in [0^\circ, 360^\circ)$).
* **Arrastre Directo:** Puede hacer clic sobre la punta de cualquier vector en el plano y desplazarla; el simulador recalculará automáticamente su magnitud y dirección.
* **Vector Resultante $\vec{R}$:** Se grafica en color destacado con línea discontinua o sólida indicando la fuerza neta del sistema concurrente.
* **Optimización de Cursor:** La detección de proximidad sobre los vectores está calculada con coordenadas normalizadas para asegurar un movimiento del puntero 100% fluido y sin retardos.

#### Subpestaña: Diagrama de Cuerpo Libre (DCL)
* Desglosa en una tabla analítica:
  * Componente horizontal $F_x = F \cdot \cos(\theta)$
  * Componente vertical $F_y = F \cdot \sin(\theta)$
  * Cuadrante de pertenencia (I, II, III, IV o ejes cartesianos)
  * Sumatoria $\Sigma F_x$, $\Sigma F_y$, magnitud resultante $|\vec{R}|$ y ángulo directriz $\theta_R$.

---

### 2.3 Módulo de Ley de Ohm y Circuitos
Ubicación: Menú lateral > **Ley de Ohm y Circuitos**

Este módulo se subdivide en dos modos:
1. **Construcción de Circuitos** (Laboratorio gráfico experimental)
2. **Calculadora y Criterios** (Comprobación analítica con diagramas esquemáticos)

---

#### 2.3.1 Construcción de Circuitos (Laboratorio Interactivo)

El entorno se compone de 4 áreas principales:

1. **Panel Lateral Izquierdo de Componentes:**
   * **Batería (Fuente DC):** Fuerza electromotriz en voltios (V).
   * **Resistencia:** Opositor al flujo eléctrico en ohmios ($\Omega$).
   * **Bombilla:** Carga luminosa cuya intensidad de brillo varía según la potencia consumida ($P = I^2 \cdot R$).
   * **Interruptor:** Dispositivo de maniobra para abrir o cerrar ramas del circuito.
   * **Cables conductores:** Elementos de conexión de baja impedancia.

2. **Mesa de Trabajo / Cuadrícula:**
   * **Arrastrar y Colocar:** Arrastre componentes al área de trabajo.
   * **Terminales Magnéticos (Snap):** Al acercar dos extremos a menos de 28 píxeles, se enlazan automáticamente.
   * **Trazado de Cables:** Haga clic en un nodo de conexión para iniciar un conductor elástico y conéctelo al terminal de destino.
   * **Rotación y Eliminación:** Botones contextuales en cada elemento para girar en ángulos de 90° o remover del circuito.

3. **Herramientas de Visualización y Medición (Barra Superior):**
   * **Sentido de Corriente:** Alterna entre **Flujo Convencional** (del polo positivo al polo negativo) y **Flujo de Electrones** (del polo negativo al polo positivo con animación de partículas).
   * **Lupa / Zoom de Valores:** Permite ampliar el tamaño de los números y textos de voltaje, resistencia y corriente para proyectar en pantallas grandes o facilitar la lectura.
   * **Voltímetro Digital:** Instrumento flotante con puntas de prueba roja ($+$) y negra ($-$). Al situarlas sobre dos nodos, mide la diferencia de potencial $\Delta V = V_{\text{roja}} - V_{\text{negra}}$.
   * **Amperímetro Virtual:** Mide la intensidad de corriente que atraviesa la rama seleccionada en miliamperios ($mA$) o amperios ($A$).

4. **Barra de Telemetría Inferior (Estado del Circuito):**
   * Ubicada inmediatamente debajo de la cuadrícula, muestra las 3 magnitudes fundamentales de la Ley de Ohm:
     * **Tensión de Fuente ($V$):** Tensión de excitación total ($V = I \cdot R$).
     * **Resistencia Equivalente ($R_{\text{eq}}$):** Oposición total al flujo de corriente ($R = V / I$).
     * **Corriente Total ($i_T$):** Flujo de carga eléctrica expresado de forma continua en **Amperios ($A$)** ($i_T = V / R_{\text{eq}}$).
     * **Estado Operativo:** Indica si el circuito es un *Bucle Cerrado Activo*, *Circuito Abierto* o *Cortocircuito*.
     * **Panel Desplegable de Cálculos Paso a Paso:** Botón colapsable que desglosa el cálculo analítico formal de los 3 criterios de diseño de la Ley de Ohm ($R_e$, $V_T$, $i_T$) con sustitución numérica detallada.

---

#### 2.3.2 Calculadora y Criterios de Diseño

Permite resolver problemas teóricos de forma estricta y se fundamenta exclusivamente en los **3 Criterios de Diseño de la Ley de Ohm**:

1. **Ley de Ohm Directa:**
   * Despeje interactivo seleccionando incógnita ($V$, $I$, o $R$).

2. **Circuito en Serie (Los 3 Criterios de Diseño):**
   * **Criterio de Tensión:** $V_T = V_1 + V_2 + V_3 + \dots$ (Suma de caídas de potencial).
   * **Criterio de Resistencia:** $R_T = R_1 + R_2 + R_3 + \dots$ (Suma directa de resistencias).
   * **Criterio de Corriente:** $i_T = i_1 = i_2 = i_3 = \dots$ (Corriente constante en toda la malla).

3. **Circuito en Paralelo (Los 3 Criterios de Diseño):**
   * **Criterio de Tensión:** $V_T = V_1 = V_2 = V_3 = \dots$ (Voltaje idéntico y común a todas las ramas).
   * **Criterio de Resistencia:** $\frac{1}{R_T} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3} + \dots$ (Suma de conductancias).
   * **Criterio de Corriente:** $i_T = i_1 + i_2 + i_3 + \dots$ (La corriente total es la suma de las corrientes de rama).

4. **Circuito Mixto (Los 3 Criterios de Diseño):**
   * **Configuración Dinámica:** Permite añadir libremente cuántas resistencias en serie se deseen ($R_1, R_2, \dots$) y cuántas ramas en paralelo se requieran ($R_3, R_4, R_5, \dots$) mediante los botones interactivos «+ Añadir Serie» y «+ Añadir Paralelo». Incluye botón de restablecimiento rápido para el ejercicio clásico de referencia (R1 a R5).
   * **Criterio de Tensión:** $V_T = \sum V_{\text{serie}} + V_p$ (Suma de tensiones en los resistores en serie más la tensión común del bloque en paralelo).
   * **Criterio de Resistencia:** $R_T = \sum R_{\text{serie}} + R_p$ (Reducción analítica del bloque en paralelo $R_p = \frac{1}{\sum 1/R}$ sumada a todas las resistencias en serie).
   * **Criterio de Corriente:** $i_T = \frac{V_T}{R_T}$ (Corriente total que atraviesa íntegramente las resistencias en serie y se subdivide en cada una de las ramas en paralelo cumpliendo $\sum i_{\text{ramas}} = i_T$).

---

### 2.4 Módulo de Diseñadores / Perfil de Autores
Ubicación: Menú lateral > **Diseñadores**

* Presenta la ficha técnica y académica del equipo de trabajo:
  * **Nombre del estudiante / desarrollador**
  * **Carrera profesional**
  * **Institución (ITCA FEPADE Zacatecoluca)**
  * **Número de Carnet**
  * **Correo Institucional y Personal**
  * **Rol y Especialidad técnica**
* **Edición en Tiempo Real:** Cuenta con un botón «Editar perfil» que abre un modal para modificar los datos y guardar los cambios reactivamente en memoria.

---

## 3. FUNDAMENTOS FÍSICOS Y FORMULACIÓN MATEMÁTICA

### 3.1 Descomposición y Suma de Vectores
Para cualquier vector $\vec{F} = (F, \theta)$ medido desde el semieje positivo de abscisas:
$$F_x = F \cdot \cos(\theta)$$
$$F_y = F \cdot \sin(\theta)$$

Para un conjunto de $n$ vectores concurrentes en el origen:
$$\Sigma F_x = \sum_{k=1}^n F_{kx}, \quad \Sigma F_y = \sum_{k=1}^n F_{ky}$$

La magnitud resultante $R$ y su dirección $\theta_R$ se obtienen por:
$$R = \sqrt{(\Sigma F_x)^2 + (\Sigma F_y)^2}$$
$$\theta_R = \operatorname{atan2}(\Sigma F_y, \Sigma F_x) \pmod{360^\circ}$$

---

### 3.2 Leyes de Kirchhoff y Ley de Ohm
1. **Primera Ley de Kirchhoff (Ley de Corrientes - LCK):**
   La suma algebraica de las corrientes que entran a un nodo es igual a cero:
   $$\sum I_{\text{entrantes}} = \sum I_{\text{salientes}}$$

2. **Segunda Ley de Kirchhoff (Ley de Voltajes - LVK):**
   La suma algebraica de las caídas de tensión a lo largo de una malla cerrada es igual a la suma de las fuerzas electromotrices:
   $$\sum V_k = 0$$

3. **Ley de Ohm:**
   $$V = I \cdot R \iff I = \frac{V}{R} \iff R = \frac{V}{I}$$

---

### 3.3 Criterios de Potencia (Efecto Joule)
La energía eléctrica transformada en calor por unidad de tiempo en un conductor resistivo está dada por:
$$P = V \cdot I = I^2 \cdot R = \frac{V^2}{R}$$

* En el simulador, se toma como referencia de seguridad una resistencia comercial de $\frac{1}{2}\text{ Watt}$ ($P_{\text{nom}} = 0.50\text{ W}$).
* Si $P > P_{\text{nom}}$, el sistema indica una sobrecarga térmica preventiva en los criterios de diseño.

---

## 4. DOCUMENTACIÓN TÉCNICA DE IMPLEMENTACIÓN

### 4.1 Estructura del Proyecto
```
/
├── src/
│   ├── App.tsx                        # Punto de entrada y enrutamiento de vistas
│   ├── types/
│   │   ├── index.ts                   # Tipos de datos para vectores, circuitos y perfiles
│   │   └── circuitBuilder.ts          # Tipos para el motor MNA y componentes gráficos
│   ├── utils/
│   │   ├── physics.ts                 # Funciones analíticas de física y vectores
│   │   └── circuitEngine.ts           # Motor nodal MNA y resolución de matrices
│   └── components/
│       ├── layout/
│       │   ├── Sidebar.tsx            # Menú lateral de navegación
│       │   └── Header.tsx             # Cabecera con selector de tema y ayuda
│       ├── home/
│       │   └── HomeView.tsx           # Vista principal de bienvenida
│       ├── vectors/
│       │   ├── VectorSimulator.tsx    # Contenedor del simulador de vectores
│       │   ├── CartesianCanvas.tsx    # Lienzo interactivo del plano cartesiano
│       │   ├── VectorControls.tsx     # Controles deslizantes e inputs de fuerzas
│       │   └── DclBreakdown.tsx       # Tabla de Diagrama de Cuerpo Libre
│       ├── circuits/
│       │   ├── CircuitSimulator.tsx   # Alternador entre Constructor y Calculadora
│       │   ├── OhmCalculator.tsx      # Calculadora analítica (Serie, Paralelo, Mixto)
│       │   ├── SeriesCircuitView.tsx  # Esquema y análisis de circuito en serie
│       │   ├── ParallelCircuitView.tsx# Esquema y análisis de circuito en paralelo
│       │   └── CircuitAnalysisView.tsx# Esquema y análisis de circuito mixto
│       ├── circuit-builder/
│       │   ├── CircuitBuilderView.tsx # Contenedor principal del laboratorio interactivo
│       │   ├── ComponentSidebar.tsx   # Paleta izquierda de componentes arrastrables
│       │   ├── CanvasWorkspace.tsx    # Mesa de trabajo con snap de nodos y rotación
│       │   ├── TopToolbar.tsx         # Barra de herramientas (flujo, lupa, instrumentos)
│       │   ├── VirtualVoltmeter.tsx   # Instrumento voltímetro con puntas roja/negra
│       │   ├── VirtualAmmeter.tsx      # Amperímetro de rama
│       │   └── CircuitStatusFooter.tsx# Barra de telemetría bajo la cuadrícula
│       ├── designers/
│       │   └── DesignersView.tsx      # Tarjetas de integrantes y edición de Carnet
│       └── modals/
│           └── HelpModal.tsx          # Modal de guía teórica y descarga de manual
```

---

### 4.2 Motor de Física Eléctrica MNA (`src/utils/circuitEngine.ts`)
El simulador no recurre a fórmulas fijas para el constructor libre; en su lugar, traduce la topología armada por el usuario a un circuito generalizado mediante **Análisis Nodal Modificado (MNA)**:

1. **Construcción del Grafo:** Identifica nodos únicos agrupando terminales que coinciden espacialmente mediante la función `findCircuitNodes`.
2. **Planteamiento Matricial:**
   $$\begin{pmatrix} G & B \\ C & D \end{pmatrix} \begin{pmatrix} v \\ j \end{pmatrix} = \begin{pmatrix} i \\ e \end{pmatrix}$$
   * $G$: Matriz de admitancias de nodo formada por las resistencias y bombillas.
   * $B$ y $C$: Matrices de incidencia de las fuentes de tensión independientes.
   * $D$: Matriz nula para fuentes ideales de tensión independientes.
   * $v$: Vector de potenciales de nodo desconocidos.
   * $j$: Vector de corrientes que fluyen por las fuentes de voltaje.
   * $i$: Inyecciones de corriente de nodo.
   * $e$: Valores de tensión de las fuentes electromotrices.

---

### 4.3 Eliminación Gaussiana con Pivoteo Parcial
Para resolver el sistema lineal $A \cdot x = b$ sin inestabilidad numérica, la función `solveLinearSystem`:
1. Busca en cada columna $i$ el elemento de mayor valor absoluto $|A_{k,i}|$ para seleccionarlo como pivote.
2. Intercambia la fila actual con la fila del pivote máximo para evitar divisiones entre valores cercanos a cero.
3. Normaliza la fila pivote y elimina los coeficientes de las demás filas hasta obtener la matriz triangular superior / identidad.
4. Devuelve el vector solución $x$ o `null` si la matriz resulta ser singular (ej. nodos completamente flotantes sin referencia de tierra).

---

### 4.4 Optimizaciones de Renderizado SVG
* **Evitar el "Lag" del Cursor:** En `CartesianCanvas.tsx`, los eventos de arrastre y sobrevuelo (`onMouseMove` y `onPointerMove`) emplean coordenadas rectangulares locales normalizadas sin invocar operaciones costosas del DOM, permitiendo un movimiento ágil del puntero a 60 fps constantes.
* **Control de Zoom y Lupa:** La escala del lienzo (`zoomLevel`) multiplica la matriz de transformación SVG (`transform="scale(...)"`) e incrementa el tamaño de fuente de los rótulos numéricos para garantizar alta legibilidad en cualquier pantalla.

---

## 5. PREGUNTAS FRECUENTES Y SOLUCIÓN DE PROBLEMAS

### ¿Por qué el voltímetro marca 0,00 V?
Asegúrate de colocar la punta roja y la punta negra en **nodos con distinto potencial**. Si ambas puntas se sitúan en el mismo conductor o en un circuito abierto sin circulación de corriente, la diferencia de potencial será cero.

### ¿Por qué una bombilla no se enciende?
1. Verifica que el interruptor esté en estado **Cerrado**.
2. Comprueba que el circuito forme un lazo continuo desde el polo positivo ($+$) de la batería hasta el polo negativo ($-$).
3. Asegúrate de que la tensión aplicada sea suficiente para la resistencia configurada en la lámpara.

### ¿Dónde puedo consultar o cambiar los datos del equipo y números de carnet?
En el archivo `src/components/designers/DesignersView.tsx`, dentro del array `INITIAL_DESIGNERS`, o directamente en pantalla ingresando a la sección **Diseñadores** y haciendo clic en **Editar perfil**.

---

