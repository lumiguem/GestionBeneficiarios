import React, { useState, useEffect } from 'react';
import type {Beneficiario, BeneficiarioExt} from "../types.ts";
import type {DocumentoIdentidad} from "../../documentos/types.ts";
import {documentosApi} from "../../documentos/services/documentos.api.ts";
import {beneficiariosApi} from "../services/beneficiarios.api.ts";
import ConfirmDialog from "../../../components/ConfirmDialog.tsx";


interface BeneficiaryFormProps {
    beneficiario?: BeneficiarioExt | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const FormularioBeneficiario: React.FC<BeneficiaryFormProps> = ({ beneficiario, onSuccess, onCancel }) => {
    const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
    const [cargando, setCargando] = useState(false);
    const [errores] = useState<Record<string, string>>({});
    const [errorNumeroDocumento, setErrorNumeroDocumento] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);



    const [datosFormulario, setDatosFormulario] = useState<Omit<Beneficiario, 'id'> & { id?: number; documentoIdentidadId?: number }>({
        nombres: '',
        apellidos: '',
        documentoIdentidadId: 0,
        numeroDocumento: '',
        fechaNacimiento: '',
        sexo: 'M'
    });

    const validarNumeroDocumento = (valor: string) => {
        if (!documentoSeleccionado) return true;

        // Solo números
        if (documentoSeleccionado.soloNumeros && !/^\d*$/.test(valor)) {
            setErrorNumeroDocumento('Solo se permiten números');
            return false;
        }

        // Longitud exacta
        if (valor.length !== documentoSeleccionado.longitud) {
            setErrorNumeroDocumento(
                `Debe tener exactamente ${documentoSeleccionado.longitud} caracteres`
            );
            return false;
        }

        setErrorNumeroDocumento(null);
        return true;
    };


    // Cargar documentos activos
    useEffect(() => {
        documentosApi.obtenerActivos().then(setDocumentos);
    }, []);

    useEffect(() => {
        if (beneficiario) {
            setDatosFormulario({
                id: beneficiario.id,
                nombres: beneficiario.nombres,
                apellidos: beneficiario.apellidos,
                documentoIdentidadId: beneficiario.documentoIdentidad?.id || 0,
                numeroDocumento: beneficiario.numeroDocumento,
                fechaNacimiento: beneficiario.fechaNacimiento.split('T')[0],
                sexo: beneficiario.sexo
            });
        }
    }, [beneficiario]);

    const documentoSeleccionado = documentos.find(d => d.id === datosFormulario.documentoIdentidadId);

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarNumeroDocumento(datosFormulario.numeroDocumento)) return;

        setConfirmOpen(true);
    };
    const confirmarGuardado = async () => {
        setCargando(true);
        try {
            await beneficiariosApi.guardar(datosFormulario);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Error al guardar el beneficiario en el backend');
        } finally {
            setCargando(false);
            setConfirmOpen(false);
        }
    };


    const claseEtiqueta = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1";
    const claseInput = (nombre: string) =>
        `w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-semibold outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errores[nombre] ? 'border-rose-400 bg-rose-50' : ''}`;

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 card-shadow">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{beneficiario ? 'Actualización de Perfil' : 'Registro de Beneficiario'}</h2>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
            </div>

            <form onSubmit={manejarEnvio} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div>
                        <label className={claseEtiqueta}>Nombres Completos</label>
                        <input type="text" className={claseInput('nombres')} placeholder="Ej. Juan Andrés" value={datosFormulario.nombres} onChange={e => setDatosFormulario({ ...datosFormulario, nombres: e.target.value })} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Apellidos Paterno/Materno</label>
                        <input type="text" className={claseInput('apellidos')} placeholder="Ej. Pérez García" value={datosFormulario.apellidos} onChange={e => setDatosFormulario({ ...datosFormulario, apellidos: e.target.value })} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Tipo de documento</label>
                        <select className={claseInput('documentoIdentidadId')} value={datosFormulario.documentoIdentidadId} onChange={e => setDatosFormulario({ ...datosFormulario, documentoIdentidadId: parseInt(e.target.value) })}>
                            <option value={0}>Seleccione documento...</option>
                            {documentos.map(d => <option key={d.id} value={d.id}>{d.nombre} — {d.pais}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Número de documento</label>
                        <input
                            type="text"
                            className={claseInput('numeroDocumento')}
                            placeholder={
                                documentoSeleccionado
                                    ? `Debe tener ${documentoSeleccionado.longitud} caracteres`
                                    : 'Seleccione tipo de documento'
                            }
                            value={datosFormulario.numeroDocumento}
                            disabled={!datosFormulario.documentoIdentidadId}
                            maxLength={documentoSeleccionado?.longitud}
                            onChange={e => {
                                const valor = e.target.value;
                                // Bloquea letras si solo números
                                if (documentoSeleccionado?.soloNumeros && !/^\d*$/.test(valor)) {
                                    return;
                                }
                                setDatosFormulario({ ...datosFormulario, numeroDocumento: valor });
                                // Feedback en vivo
                                if (documentoSeleccionado) {
                                    if (valor.length !== documentoSeleccionado.longitud) {
                                        setErrorNumeroDocumento(
                                            `Debe tener ${documentoSeleccionado.longitud} caracteres`
                                        );
                                    } else {
                                        setErrorNumeroDocumento(null);
                                    }
                                }
                            }}
                        />
                        {errorNumeroDocumento && (
                            <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">
                                {errorNumeroDocumento}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Fecha de Nacimiento</label>
                        <input type="date" className={claseInput('fechaNacimiento')} value={datosFormulario.fechaNacimiento} onChange={e => setDatosFormulario({ ...datosFormulario, fechaNacimiento: e.target.value })} />
                    </div>
                    <div>
                        <label className={claseEtiqueta}>Género Registrado</label>
                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-[1.25rem]">
                            <button
                                type="button"
                                onClick={() => setDatosFormulario({ ...datosFormulario, sexo: 'M' })}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${datosFormulario.sexo === 'M' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Masculino
                            </button>
                            <button
                                type="button"
                                onClick={() => setDatosFormulario({ ...datosFormulario, sexo: 'F' })}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${datosFormulario.sexo === 'F' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Femenino
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
                    <button type="button" onClick={onCancel} className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all">Descartar</button>
                    <button type="submit" disabled={cargando} className="px-12 py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                        {cargando ? 'Sincronizando...' : beneficiario ? 'Actualizar Información' : 'Registrar'}
                    </button>
                </div>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                title={beneficiario ? 'Confirmar actualización' : 'Confirmar registro'}
                description={
                    beneficiario
                        ? '¿Estás seguro de actualizar la información del beneficiario?'
                        : '¿Deseas registrar este nuevo beneficiario?'
                }
                confirmText={beneficiario ? 'Actualizar' : 'Registrar'}
                loading={cargando}
                onConfirm={confirmarGuardado}
                onCancel={() => setConfirmOpen(false)}
            />

        </div>

    );
};

export default FormularioBeneficiario;
