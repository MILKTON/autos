export interface ColorEngomado {
  nombre: string;
  color: string;
  terminaciones: string[];
}

export interface ResultadoColorEngomado {
  nombre: string;
  color: string;
}

export interface VigenciaColorMap {
  vencida: string;
  proxima: string;
  vigente: string;
  sinVigencia: string;
}

export const coloresEngomado: ColorEngomado[] = [
  { nombre: 'Amarillo', color: '#f8bc00', terminaciones: ['5', '6'] },
  { nombre: 'Rosa', color: '#da4993', terminaciones: ['7', '8'] },
  { nombre: 'Rojo', color: '#e02f31', terminaciones: ['3', '4'] },
  { nombre: 'Verde', color: '#00953a', terminaciones: ['1', '2'] },
  { nombre: 'Azul', color: '#00a2db', terminaciones: ['9', '0'] }
];

export function obtenerColorEngomado(terminacion: string | number): ResultadoColorEngomado {
  const t = terminacion.toString();
  return coloresEngomado.find((c) => c.terminaciones.includes(t)) || { nombre: 'Sin color', color: '#CCCCCC' };
}

export function clasificarVigencia(vigencia?: string): keyof VigenciaColorMap {
  if (!vigencia) return 'sinVigencia';

  const [dia, mes, anio] = vigencia.split('/');
  const fechaVigencia = new Date(`${anio}-${mes}-${dia}`);
  const hoy = new Date();

  const diff = (fechaVigencia.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
  const añoActual = hoy.getFullYear();
  const añoVigencia = fechaVigencia.getFullYear();

  if (diff < 0) return 'vencida';
  if (añoVigencia === añoActual) return 'proxima';

  return 'vigente';
}

export function obtenerColorVigencia(vigencia?: string): string {
  const colores: VigenciaColorMap = {
    vencida: '#e74c3c',
    proxima: '#f39c12',
    vigente: '#27ae60',
    sinVigencia: '#CCC'
  };
  return colores[clasificarVigencia(vigencia)];
}

export const periodosTerminaciones = [
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
