export interface Estadisticas {
    total: number;
    porGenero: { M: number; F: number };
    porPais: Record<string, number>;
}