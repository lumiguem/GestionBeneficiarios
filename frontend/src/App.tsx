
import React, { useState } from 'react';
import ListaBeneficiarios from './features/beneficiarios/components/ListaBeneficiarios.tsx';
import FormularioBeneficiario from './features/beneficiarios/components/FormularioBeneficiario.tsx';
import ListaDocumentos from './features/documentos/components/ListaDocumentos.tsx';
import EstadisticasDashboard from './features/dashboard/components/DashboardStats.tsx';
import type {BeneficiarioExt} from "./features/beneficiarios/types.ts";
import {UserCog} from "lucide-react";

const App: React.FC = () => {
    const [vista, setVista] = useState<'lista' | 'formulario' | 'documentos'>('lista');
    const [beneficiarioEnEdicion, setBeneficiarioEnEdicion] = useState<BeneficiarioExt | null>(null);
    const [alternarRefresco, setAlternarRefresco] = useState(false);

    const manejarEdicion = (beneficiario: BeneficiarioExt) => {
        setBeneficiarioEnEdicion(beneficiario);
        setVista('formulario');
    };

    const manejarNuevo = () => {
        setBeneficiarioEnEdicion(null);
        setVista('formulario');
    };

    const manejarExito = () => {
        setVista('lista');
        setAlternarRefresco(p => !p);
    };

    const IconoLista = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    const IconoForm = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
    const IconoDocs = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

    const ItemNavegacion = ({ icono, etiqueta, id }: { icono: React.ReactNode, etiqueta: string, id: typeof vista }) => (
        <button
            onClick={() => setVista(id)}
            className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                vista === id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
        >
      <span className={`${vista === id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icono}
      </span>
            <span className="font-semibold text-sm tracking-tight">{etiqueta}</span>
        </button>
    );

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-72 sidebar-blur text-white flex-col shrink-0 border-r border-slate-800 shadow-2xl z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-600/20">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tighter">Gestion beneficiarios<span className="text-indigo-500">.</span></h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 pl-1">Plataforma empresarial</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <ItemNavegacion id="lista" etiqueta="Resumen General" icono={<IconoLista />} />
                    <ItemNavegacion id="formulario" etiqueta="Altas y Registros" icono={<IconoForm />} />
                    <ItemNavegacion id="documentos" etiqueta="Documentos Legales" icono={<IconoDocs />} />
                </nav>

                <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                <UserCog className="w-5 h-5 text-slate-200" />
                            </div>

                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-100 truncate">Miguel Moreno</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Container */}
            <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                        </div>
                        <h1 className="text-base font-extrabold tracking-tighter">Gestion de beneficiarios<span className="text-indigo-500">.</span></h1>
                    </div>

                    <div className="hidden sm:block">
                        <h2 className="text-sm lg:text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-slate-400 font-normal">Módulo /</span>
                            {vista === 'lista' ? 'Gestión' : vista === 'formulario' ? 'Registro' : 'Sistema'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <button onClick={manejarNuevo} className="px-3 py-2 lg:px-5 lg:py-2.5 bg-indigo-600 text-white text-xs lg:text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-95">
                            + Nuevo
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                        {vista === 'lista' ? (
                            <div className="space-y-6 lg:space-y-10">
                                <EstadisticasDashboard alternarRefresco={alternarRefresco} />
                                <ListaBeneficiarios
                                    onEdit={manejarEdicion}
                                    refreshToggle={alternarRefresco}
                                    onDeleteSuccess={() => setAlternarRefresco(p => !p)}
                                />
                            </div>
                        ) : vista === 'formulario' ? (
                            <div className="max-w-4xl mx-auto py-2 lg:py-4">
                                <button
                                    onClick={() => setVista('lista')}
                                    className="mb-6 lg:mb-8 flex items-center text-slate-500 hover:text-indigo-600 font-bold text-xs lg:text-sm transition-colors group"
                                >
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Regresar
                                </button>
                                <FormularioBeneficiario beneficiario={beneficiarioEnEdicion} onSuccess={manejarExito} onCancel={() => setVista('lista')} />
                            </div>
                        ) : (
                            <div className="max-w-6xl mx-auto py-2 lg:py-4">
                                <button
                                    onClick={() => setVista('lista')}
                                    className="mb-6 lg:mb-8 flex items-center text-slate-500 hover:text-indigo-600 font-bold text-xs lg:text-sm transition-colors group"
                                >
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Regresar
                                </button>
                                <ListaDocumentos />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                <button onClick={() => setVista('lista')} className={`flex flex-col items-center gap-1 ${vista === 'lista' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <IconoLista />
                    <span className="text-[10px] font-bold">Dashboard</span>
                </button>
                <button onClick={manejarNuevo} className={`flex flex-col items-center gap-1 ${vista === 'formulario' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <IconoForm />
                    <span className="text-[10px] font-bold">Registro</span>
                </button>
                <button onClick={() => setVista('documentos')} className={`flex flex-col items-center gap-1 ${vista === 'documentos' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <IconoDocs />
                    <span className="text-[10px] font-bold">Protocolos</span>
                </button>
            </nav>
        </div>
    );
};

export default App;
