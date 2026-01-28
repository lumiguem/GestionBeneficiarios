
import React, { useState, useEffect } from 'react';
import type {Beneficiario, DocumentoIdentidad} from '../types.ts';
import { servicioApi } from '../services/api';

interface BeneficiaryFormProps {
    beneficiario?: Beneficiario | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const FormularioBeneficiario: React.FC<BeneficiaryFormProps> = ({ beneficiario, onSuccess, onCancel }) => {
    const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
    const [cargando, setCargando] = useState(false);
    const [errores] = useState<Record<string, string>>({});

    const [datosFormulario, setDatosFormulario] = useState<Omit<Beneficiario, 'Id'> & { Id?: number }>({
        Nombres: '', Apellidos: '', DocumentoIdentidadId: 0, NumeroDocumento: '', FechaNacimiento: '', Sexo: 'M'
    });

    useEffect(() => {
        servicioApi.obtenerDocumentosActivos().then(setDocumentos);
    }, []);

    useEffect(() => {
        if (beneficiario) setDatosFormulario({ ...beneficiario });
    }, [beneficiario]);

    const documentoSeleccionado = documentos.find(d => d.Id === datosFormulario.DocumentoIdentidadId);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        try {
            await servicioApi.guardarBeneficiario(datosFormulario);
            onSuccess();
        } catch (err) {
            alert('Error en la persistencia de datos');
        } finally {
            setCargando(false);
        }
    };

    const claseEtiqueta = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1";
    const claseInput = (nombre: string) => `w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-semibold outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errores[nombre] ? 'border-rose-400 bg-rose-50' : ''}`;

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 card-shadow">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{beneficiario ? 'Actualización de Perfil' : 'Registro de Entidad'}</h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Garantice la integridad de los datos biométricos y legales.</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
            </div>

            <form onSubmit={manejarEnvio} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div>
                        <label className={claseEtiqueta}>Nombres Completos</label>
                        <input type="text" className={claseInput('Nombres')} placeholder="Ej. Juan Andrés" value={datosFormulario.Nombres} onChange={e => setDatosFormulario({...datosFormulario, Nombres: e.target.value})} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Apellidos Paterno/Materno</label>
                        <input type="text" className={claseInput('Apellidos')} placeholder="Ej. Pérez García" value={datosFormulario.Apellidos} onChange={e => setDatosFormulario({...datosFormulario, Apellidos: e.target.value})} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Documento de Identidad</label>
                        <select className={claseInput('DocumentoIdentidadId')} value={datosFormulario.DocumentoIdentidadId} onChange={e => setDatosFormulario({...datosFormulario, DocumentoIdentidadId: parseInt(e.target.value)})}>
                            <option value={0}>Seleccione protocolo...</option>
                            {documentos.map(d => <option key={d.Id} value={d.Id}>{d.Nombre} — {d.Pais}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Número Identificador</label>
                        <input type="text" className={claseInput('NumeroDocumento')} placeholder="Nº de documento oficial" value={datosFormulario.NumeroDocumento} onChange={e => setDatosFormulario({...datosFormulario, NumeroDocumento: e.target.value})} disabled={!datosFormulario.DocumentoIdentidadId} maxLength={documentoSeleccionado?.Longitud} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Fecha de Nacimiento</label>
                        <input type="date" className={claseInput('FechaNacimiento')} value={datosFormulario.FechaNacimiento} onChange={e => setDatosFormulario({...datosFormulario, FechaNacimiento: e.target.value})} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Género Registrado</label>
                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-[1.25rem]">
                            <button
                                type="button"
                                onClick={() => setDatosFormulario({...datosFormulario, Sexo: 'M'})}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${datosFormulario.Sexo === 'M' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Masculino
                            </button>
                            <button
                                type="button"
                                onClick={() => setDatosFormulario({...datosFormulario, Sexo: 'F'})}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${datosFormulario.Sexo === 'F' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Femenino
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
                    <button type="button" onClick={onCancel} className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all">Descartar</button>
                    <button type="submit" disabled={cargando} className="px-12 py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                        {cargando ? 'Sincronizando...' : beneficiario ? 'Actualizar Información' : 'Consolidar Registro'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioBeneficiario;
