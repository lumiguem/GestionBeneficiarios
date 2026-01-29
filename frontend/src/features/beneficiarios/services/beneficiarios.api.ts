import type { Beneficiario, BeneficiarioExt } from '../types';
import {http} from "../../../services/api.ts";
import {documentosApi} from "../../documentos/services/documentos.api.ts";

function construirEtiqueta(b: Beneficiario): string {
    return b.documentoIdentidad
        ? `${b.documentoIdentidad.abreviatura} (${b.documentoIdentidad.pais})`
        : 'N/D';
}

export const beneficiariosApi = {

    obtenerTodos: async (): Promise<BeneficiarioExt[]> => {
        const beneficiarios = await http<Beneficiario[]>('/Beneficiario');

        return beneficiarios.map(b => ({
            ...b,
            etiquetaDocumento: construirEtiqueta(b)
        }));
    },

    obtenerPorId: async (id: number): Promise<Beneficiario | null> => {
        try {
            return await http(`/Beneficiario/${id}`);
        } catch {
            return null;
        }
    },

    guardar: async (
        datos: Omit<Beneficiario, 'id'> & { id?: number }
    ): Promise<BeneficiarioExt> => {

        const metodo = datos.id ? 'PUT' : 'POST';
        const url = datos.id
            ? `/Beneficiario/${datos.id}`
            : `/Beneficiario`;

        const documentos = await documentosApi.obtenerActivos();
        const docSeleccionado = documentos.find(
            d => d.id === datos.documentoIdentidadId
        );

        if (!docSeleccionado) {
            throw new Error('Documento de identidad inválido');
        }

        const payload = {
            Nombres: datos.nombres,
            Apellidos: datos.apellidos,
            DocumentoIdentidad: {
                Id: docSeleccionado.id,
                Nombre: docSeleccionado.nombre,
                Pais: docSeleccionado.pais,
                Abreviatura: docSeleccionado.abreviatura,
                Activo: docSeleccionado.activo
            },
            NumeroDocumento: datos.numeroDocumento,
            FechaNacimiento: datos.fechaNacimiento,
            Sexo: datos.sexo
        };

        const b = await http<BeneficiarioExt>(url, {
            method: metodo,
            body: JSON.stringify(payload)
        });

        return {
            ...b,
            documentoIdentidadId: b.documentoIdentidad?.id || 0,
            etiquetaDocumento: construirEtiqueta(b)
        };
    },

    eliminar: (id: number): Promise<void> =>
        http(`/Beneficiario/${id}`, { method: 'DELETE' })
};
