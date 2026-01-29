import type {DocumentoIdentidad} from "../documentos/types.ts";

export type sexo = 'M' | 'F';

export interface Beneficiario {
    id: number;
    nombres: string;
    apellidos: string;
    documentoIdentidadId: number;
    numeroDocumento: string;
    fechaNacimiento: string;
    sexo: sexo;
    documentoIdentidad?:DocumentoIdentidad;
}

export interface BeneficiarioExt extends Beneficiario {
    etiquetaDocumento?: string;
}