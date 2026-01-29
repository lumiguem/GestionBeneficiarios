import type { DocumentoIdentidad } from '../types';
import {http} from "../../../services/api.ts";

export const documentosApi = {

    obtenerTodos: (): Promise<DocumentoIdentidad[]> =>
        http('/DocumentoIdentidad'),

    obtenerActivos: async (): Promise<DocumentoIdentidad[]> => {
        const docs = await documentosApi.obtenerTodos();
        return docs.filter(d => d.activo);
    },

    alternarEstado: (id: number): Promise<void> =>
        http(`/DocumentoIdentidad/${id}/alternar-estado`, {
            method: 'PATCH'
        })
};
