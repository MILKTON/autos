// components/Home.tsx
import { useMemo, useState } from 'react';
import dataJson from './data.json';
import { obtenerColorEngomado, obtenerColorVigencia, clasificarVigencia } from '@utils/vehicles';

interface Vehiculo {
  placa: string;
  terminacion: string | number;
  tecnico: string;
  serie: string;
  modelo: string;
  año: number;
  vigencia?: string;
}

interface ResumenVigenciaProps {
  vencidas: number;
  proximas: number;
  vigentes: number;
}

interface TablaVehiculosProps {
  vehiculos: Vehiculo[];
  onEditar: (vehiculo: Vehiculo) => void;
  onEliminar: (placa: string, serie: string) => void;
  obtenerColorEngomado: (terminacion: string | number) => { nombre: string; color: string };
  obtenerColorVigencia: (vigencia?: string) => string;
}

interface PeriodoTerminacion {
  periodo: string;
  terminaciones: string[];
}

const coloresEngomado = [
  { nombre: 'Amarillo', color: '#f8bc00', terminaciones: ['5', '6'] },
  { nombre: 'Rosa', color: '#da4993', terminaciones: ['7', '8'] },
  { nombre: 'Rojo', color: '#e02f31', terminaciones: ['3', '4'] },
  { nombre: 'Verde', color: '#00953a', terminaciones: ['1', '2'] },
  { nombre: 'Azul', color: '#00a2db', terminaciones: ['9', '0'] }
];

const periodosTerminaciones = [
  { meses: [1, 2], periodo: 'Enero-Febrero', terminaciones: ['5', '6'] },
  { meses: [2, 3], periodo: 'Febrero-Marzo', terminaciones: ['7', '8'] },
  { meses: [3, 4], periodo: 'Marzo-Abril', terminaciones: ['3', '4'] },
  { meses: [4, 5], periodo: 'Abril-Mayo', terminaciones: ['1', '2'] },
  { meses: [5, 6], periodo: 'Mayo-Junio', terminaciones: ['9', '0'] },
  { meses: [7, 8], periodo: 'Julio-Agosto', terminaciones: ['5', '6'] },
  { meses: [8, 9], periodo: 'Agosto-Septiembre', terminaciones: ['7', '8'] },
  { meses: [9, 10], periodo: 'Septiembre-Octubre', terminaciones: ['3', '4'] },
  { meses: [10, 11], periodo: 'Octubre-Noviembre', terminaciones: ['1', '2'] },
  { meses: [11, 12], periodo: 'Noviembre-Diciembre', terminaciones: ['9', '0'] }
];

const hidden = true;

function obtenerPeriodosTerminacion(mes: number): PeriodoTerminacion[] {
  return periodosTerminaciones.filter(({ meses }) => meses.includes(mes)).map(({ periodo, terminaciones }) => ({ periodo, terminaciones }));
}

function obtenerColorEngomadoPorTerminaciones(terminaciones: string[]) {
  return (
    coloresEngomado.find(({ terminaciones: t }) => terminaciones.some((term) => t.includes(term))) || {
      nombre: 'Sin color',
      color: '#CCCCCC'
    }
  );
}

interface PeriodoVerificacionProps {
  onColorSelect: (color: string) => void;
}

const PeriodoVerificacion = ({ onColorSelect }: PeriodoVerificacionProps) => {
  const mesActual = new Date().getMonth() + 1;
  const periodos = obtenerPeriodosTerminacion(mesActual);

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start', marginBottom: '24px' }}>
      {periodos.map(({ periodo, terminaciones }) => {
        const colorEngomado = obtenerColorEngomadoPorTerminaciones(terminaciones);
        return (
          <div
            key={periodo}
            onClick={() => onColorSelect(colorEngomado.nombre)}
            style={{
              backgroundColor: colorEngomado.color,
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div>Este mes verifican placas con terminación:</div>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{terminaciones.join(' o ')}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
              <em>({periodo})</em>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ResumenVigencia = ({ vencidas, proximas, vigentes }: ResumenVigenciaProps) => {
  const resumenItems = [
    { label: 'Vigentes', color: '#27ae60', valor: vigentes },
    { label: 'Próximas', color: '#f39c12', valor: proximas },
    { label: 'Vencidas', color: '#e74c3c', valor: vencidas }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '8px',
        boxSizing: 'border-box',
        alignItems: 'center'
      }}
    >
      {resumenItems.map(({ label, color, valor }) => (
        <div
          key={label}
          style={{
            backgroundColor: color,
            color: '#fff',
            borderRadius: 6,
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: `0 0 6px ${color}aa`,
            textAlign: 'center',
            width: '100%'
          }}
        >
          <div>{label}</div>
          <div style={{ fontSize: 20, marginTop: 4 }}>{valor}</div>
        </div>
      ))}
    </div>
  );
};

const TablaVehiculos = ({ vehiculos, onEditar, onEliminar, obtenerColorEngomado, obtenerColorVigencia }: TablaVehiculosProps) => (
  <table border={1} cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', whiteSpace: 'nowrap' }}>
    <thead style={{ backgroundColor: 'lightgray' }}>
      <tr>
        <th>PLACA</th>
        <th>TERMINACIÓN</th>
        <th>TÉCNICO</th>
        <th>ENGOMADO</th>
        <th>SERIE</th>
        <th>MODELO</th>
        <th>AÑO</th>
        <th>VIGENCIA PLACAS</th>
        {!hidden && <th>ACCIONES</th>}
      </tr>
    </thead>
    <tbody style={{ backgroundColor: '#eee' }}>
      {vehiculos.map((v, i) => {
        const colorEngomado = obtenerColorEngomado(v.terminacion);
        return (
          <tr key={i}>
            <td
              style={{
                fontFamily: 'monospace',
                textAlign: 'center' // o 'left' si prefieres alineado como Excel
              }}
            >
              {v.placa}
            </td>
            <td>{v.terminacion}</td>
            <td>{v.tecnico}</td>
            <td style={{ backgroundColor: colorEngomado.color, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
              {colorEngomado.nombre}
            </td>
            <td style={{ textAlign: 'center' }}>{v.serie}</td>
            <td>{v.modelo}</td>
            <td>{v.año}</td>
            <td style={{ backgroundColor: obtenerColorVigencia(v.vigencia), color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
              {v.vigencia || '-'}
            </td>
            {!hidden && (
              <td>
                <button onClick={() => onEditar(v)}>✏️</button>
                <button onClick={() => onEliminar(v.placa, v.serie)}>🗑️</button>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  </table>
);

const ModalEdicion = ({
  vehiculo,
  onGuardar,
  onCancelar
}: {
  vehiculo: Vehiculo;
  onGuardar: (v: Vehiculo) => void;
  onCancelar: () => void;
}) => {
  const [form, setForm] = useState<Vehiculo>(vehiculo);
  const handleChange = (campo: keyof Vehiculo, valor: string) => {
    setForm({ ...form, [campo]: campo === 'año' ? Number(valor) : valor });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
        <h3>Editar Vehículo</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['placa', 'terminacion', 'tecnico', 'serie', 'modelo', 'año', 'vigencia'].map((campo) => (
            <div key={campo}>
              <label>{campo.toUpperCase()}</label>
              <input
                value={form[campo as keyof Vehiculo] ?? ''}
                onChange={(e) => handleChange(campo as keyof Vehiculo, e.target.value)}
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancelar} style={{ background: '#ccc' }}>
            Cancelar
          </button>
          <button onClick={() => onGuardar(form)} style={{ background: '#27ae60', color: '#fff' }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(dataJson);
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState<Vehiculo | null>(null);
  const [filtroColor, setFiltroColor] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const eliminarVehiculo = (placa: string, serie: string) => {
    setVehiculos((prev) => prev.filter((v) => v.placa !== placa || v.serie !== serie));
  };

  const guardarCambios = (vehiculoEditado: Vehiculo) => {
    setVehiculos((prev) => prev.map((v) => (v.placa === vehiculoEditado.placa && v.serie === vehiculoEditado.serie ? vehiculoEditado : v)));
    setVehiculoEnEdicion(null);
  };

  const busquedaLower = busqueda.toLowerCase();
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const { nombre } = obtenerColorEngomado(vehiculo.terminacion);
    const coincideColor = filtroColor === 'todos' || nombre === filtroColor;
    const coincideBusqueda = vehiculo.placa.toLowerCase().includes(busquedaLower) || vehiculo.serie.toLowerCase().includes(busquedaLower);
    return coincideColor && coincideBusqueda;
  });

  const resumen = useMemo(() => {
    const result = { vencidas: 0, proximas: 0, vigentes: 0 };
    vehiculos.forEach((v) => {
      const estadoMap: Record<string, keyof typeof result> = {
        vencida: 'vencidas',
        proximas: 'proximas',
        vigente: 'vigentes'
      };
      const estado = clasificarVigencia(v.vigencia);
      const resumenKey = estadoMap[estado];
      if (resumenKey) result[resumenKey]++;
    });
    return result;
  }, [vehiculos]);

  return (
    <div style={{ width: '100%', padding: '20px', backgroundColor: '#f1f1f1' }}>
      <div style={{ maxWidth: '80%', margin: 'auto', padding: 20, backgroundColor: '#f1f1f1', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, justifyContent: 'space-between' }}>
          <div style={{ flex: 2 }}>
            <h3 style={{ marginBottom: 8 }}>Información de Vehículos</h3>
            <PeriodoVerificacion onColorSelect={(color) => setFiltroColor(color)} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 8 }}>Vigencia de placas</h3>
            <ResumenVigencia vencidas={resumen.vencidas} proximas={resumen.proximas} vigentes={resumen.vigentes} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <label>Filtrar por color: </label>
            <select value={filtroColor} onChange={(e) => setFiltroColor(e.target.value)}>
              <option value="todos">Todos</option>
              {coloresEngomado.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Buscar: </label>
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej. 965XEL o 3G1SF..." />
          </div>
        </div>

        <TablaVehiculos
          vehiculos={vehiculosFiltrados}
          onEditar={setVehiculoEnEdicion}
          onEliminar={eliminarVehiculo}
          obtenerColorEngomado={obtenerColorEngomado}
          obtenerColorVigencia={obtenerColorVigencia}
        />

        {vehiculoEnEdicion && (
          <ModalEdicion vehiculo={vehiculoEnEdicion} onGuardar={guardarCambios} onCancelar={() => setVehiculoEnEdicion(null)} />
        )}
      </div>
    </div>
  );
};

export default Home;
