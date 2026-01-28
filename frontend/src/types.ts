
export interface DocumentoIdentidad {
    Id: number;
    Nombre: string;
    Abreviatura: string;
    Pais: string;
    Longitud: number;
    SoloNumeros: boolean;
    Activo: boolean;
}

export type Sexo = 'M' | 'F';

export interface Beneficiario {
    Id: number;
    Nombres: string;
    Apellidos: string;
    DocumentoIdentidadId: number;
    NumeroDocumento: string;
    FechaNacimiento: string;
    Sexo: Sexo;
}

export interface BeneficiarioExt extends Beneficiario {
    EtiquetaDocumento?: string;
}

export interface Estadisticas {
    total: number;
    porGenero: { M: number; F: number };
    porPais: Record<string, number>;
}
