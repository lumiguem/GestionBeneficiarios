
import React, { useEffect, useState } from 'react';
import {beneficiariosApi} from "../../beneficiarios/services/beneficiarios.api.ts";

const EstadisticasDashboard: React.FC<{ alternarRefresco: boolean }> = ({ alternarRefresco }) => {
    const [datos, setDatos] = useState({ total: 0, hombres: 0, mujeres: 0, edadPromedio: 0 });

    useEffect(() => {
        const calcular = async () => {
            const lista = await beneficiariosApi.obtenerTodos();
            const h = lista.filter(b => b.sexo === 'M').length;
            const m = lista.filter(b => b.sexo === 'F').length;
            const calcularEdad = (fechaNacimiento: string) => {
                const hoy = new Date();
                const nacimiento = new Date(fechaNacimiento);
                let edad = hoy.getFullYear() - nacimiento.getFullYear();
                const mes = hoy.getMonth() - nacimiento.getMonth();
                if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                    edad--;
                }
                return edad;
            };
            const anios = lista.map(b => calcularEdad(b.fechaNacimiento));
            const promedio = anios.length > 0 ? anios.reduce((a, b) => a + b, 0) / anios.length : 0;
            setDatos({ total: lista.length, hombres: h, mujeres: m, edadPromedio: Math.round(promedio) });
        };
        calcular();
    }, [alternarRefresco]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="sm:col-span-2 lg:col-span-2 bg-indigo-600 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20 group">
                <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <svg className="w-48 h-48 lg:w-64 lg:h-64 -mr-12 lg:-mr-16 -mt-12 lg:-mt-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/></svg>
                </div>
                <div className="relative z-10">
                    <p className="text-indigo-100 font-bold uppercase tracking-widest text-[9px] lg:text-[10px] mb-1 lg:mb-2">Población Impactada</p>
                    <h3 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-2 lg:mb-4">{datos.total}</h3>
                    <p className="text-indigo-100/80 text-xs lg:text-sm max-w-[240px] leading-relaxed">Total de beneficiarios activos en el sistema central.</p>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-slate-100 card-shadow flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                    <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-blue-50 text-blue-600">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <span className="text-[9px] lg:text-[10px] font-black text-blue-400 bg-blue-50 px-2 lg:px-3 py-1 rounded-full uppercase">Segmento</span>
                </div>
                <div className="mt-4">
                    <h4 className="text-2xl lg:text-3xl font-extrabold text-slate-800">{datos.hombres}</h4>
                    <p className="text-slate-400 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider mt-1">Hombres</p>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-slate-100 card-shadow flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                    <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-rose-50 text-rose-600">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/></svg>
                    </div>
                    <span className="text-[9px] lg:text-[10px] font-black text-rose-400 bg-rose-50 px-2 lg:px-3 py-1 rounded-full uppercase">Segmento</span>
                </div>
                <div className="mt-4">
                    <h4 className="text-2xl lg:text-3xl font-extrabold text-slate-800">{datos.mujeres}</h4>
                    <p className="text-slate-400 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider mt-1">Mujeres</p>
                </div>
            </div>

            <div className="sm:col-span-1 bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-slate-100 card-shadow flex flex-col justify-between relative overflow-hidden min-h-[140px]">
                <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
                    <svg className="w-20 h-20 lg:w-24 lg:h-24 -mr-3 lg:-mr-4 -mb-3 lg:-mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <div className="mt-4">
                    <h4 className="text-2xl lg:text-3xl font-extrabold text-slate-800">{datos.edadPromedio}<span className="text-xs text-slate-400 font-bold ml-1">años</span></h4>
                    <p className="text-slate-400 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider mt-1">Promedio Edad</p>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasDashboard;
