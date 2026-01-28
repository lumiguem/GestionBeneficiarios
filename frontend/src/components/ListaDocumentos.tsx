
import React, { useState, useEffect } from 'react';
import { DocumentoIdentidad } from '../types';
import { servicioApi } from '../services/api';

const ListaDocumentos: React.FC = () => {
    const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarDocs = async () => {
        setCargando(true);
        const datos = await servicioApi.obtenerDocumentos();
        setDocumentos(datos);
        setCargando(false);
    };

    useEffect(() => { cargarDocs(); }, []);

    const manejarAlternar = async (id: number) => {
        await servicioApi.alternarEstadoDocumento(id);
        cargarDocs();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Protocolos de Identidad</h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Configuración de parámetros legales y validaciones por territorio.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cargando ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold animate-pulse">Consultando catálogos internacionales...</div>
                ) : documentos.map(doc => (
                    <div key={doc.Id} className={`bg-white p-8 rounded-[2.5rem] border border-slate-200 card-shadow transition-all group ${!doc.Activo ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <span className="text-indigo-600 font-black text-xl">{doc.Abreviatura[0]}</span>
                            </div>
                            <button
                                onClick={() => manejarAlternar(doc.Id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    doc.Activo
                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600'
                                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700'
                                }`}
                            >
                                {doc.Activo ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>

                        <h4 className="text-lg font-extrabold text-slate-900 mb-2">{doc.Nombre}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                            <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            {doc.Pais}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidad</p>
                                <p className="text-slate-800 font-bold text-sm">{doc.Longitud} Chars</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo de Dato</p>
                                <p className="text-slate-800 font-bold text-sm">{doc.SoloNumeros ? 'Núm' : 'Alfa'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaDocumentos;
