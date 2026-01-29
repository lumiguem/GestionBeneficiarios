import React, { useState, useEffect } from 'react';
import type { BeneficiarioExt } from "../types.ts";
import { beneficiariosApi } from "../services/beneficiarios.api.ts";

interface BeneficiaryListProps {
    onEdit: (beneficiario: BeneficiarioExt) => void;
    refreshToggle: boolean;
    onDeleteSuccess: () => void; // ✅ NUEVO
}

const ListaBeneficiarios: React.FC<BeneficiaryListProps> = ({
                                                                onEdit,
                                                                refreshToggle,
                                                                onDeleteSuccess
                                                            }) => {
    const [beneficiarios, setBeneficiarios] = useState<BeneficiarioExt[]>([]);
    const [cargando, setCargando] = useState(true);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    const cargarDatos = async () => {
        setCargando(true);
        const datos = await beneficiariosApi.obtenerTodos();
        setBeneficiarios(datos);
        setCargando(false);
    };

    useEffect(() => {
        cargarDatos();
    }, [refreshToggle]);

    const manejarEliminar = async (id: number) => {
        if (window.confirm('¿Confirmar baja definitiva del sistema?')) {
            await beneficiariosApi.eliminar(id);
            onDeleteSuccess(); // 🔥 AVISA AL PADRE
        }
    };

    const filtrados = beneficiarios.filter(b =>
        `${b.nombres} ${b.apellidos}`.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        b.numeroDocumento.includes(terminoBusqueda)
    );

    return (
        <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200 card-shadow overflow-hidden">
            <div className="p-5 lg:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6">
                <div>
                    <h3 className="text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight">Registro Maestro</h3>
                    <p className="text-xs lg:text-sm text-slate-400 font-medium">Visualización y gestión de beneficiarios</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-10 lg:pl-12 pr-4 lg:pr-6 py-2.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl w-full md:w-80 lg:w-96 text-xs lg:text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        value={terminoBusqueda}
                        onChange={e => setTerminoBusqueda(e.target.value)}
                    />
                    <svg className="absolute left-3.5 top-2.5 lg:top-3 h-4 lg:h-5 w-4 lg:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[9px] lg:text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                        <th className="px-5 lg:px-8 py-4">Beneficiario</th>
                        <th className="px-5 lg:px-8 py-4">Documento</th>
                        <th className="px-5 lg:px-8 py-4">Estatus Legal</th>
                        <th className="px-5 lg:px-8 py-4 text-right">Controles</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {cargando ? (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Sincronizando registros...</td></tr>
                    ) : filtrados.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-300 italic font-medium">No se encontraron registros activos</td></tr>
                    ) : (
                        filtrados.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                                <td className="px-5 lg:px-8 py-4 lg:py-5">
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-xs lg:text-sm shadow-sm shrink-0 ${b.sexo === 'M' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {b.nombres[0]}{b.apellidos[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate text-sm lg:text-base">{b.nombres} {b.apellidos}</div>
                                            <div className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-wider">{new Date(b.fechaNacimiento).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 lg:px-8 py-4 lg:py-5">
                                    <div className="font-mono text-xs lg:text-sm font-bold text-slate-700">{b.numeroDocumento}</div>
                                    <div className="text-[9px] lg:text-[10px] text-slate-400 font-b old uppercase tracking-tighter">{b.etiquetaDocumento}</div>
                                </td>
                                <td className="px-5 lg:px-8 py-4 lg:py-5">
                    <span className={`px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${b.sexo === 'M' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                      {b.sexo === 'M' ? 'Masculino' : 'Femenino'}
                    </span>
                                </td>
                                <td className="px-5 lg:px-8 py-4 lg:py-5">
                                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                                        <button onClick={() => onEdit(b)} className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90">
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => manejarEliminar(b.id)} className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90">
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <div className="px-5 lg:px-8 py-4 lg:py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Mostrando {filtrados.length} Registros</span>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Anterior</button>
                    <button className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Siguiente</button>
                </div>
            </div>
        </div>
    );
};

export default ListaBeneficiarios;
