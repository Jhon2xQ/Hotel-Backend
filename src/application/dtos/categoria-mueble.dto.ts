export interface CreateCategoriaMuebleDto {
    nombre: string;
    descripcoion?: string;
    activo: boolean;
}

export interface UpdateCategoriaMuebleDto {
    nombre?: string;    
    descripcoion?: string;
    activo?: boolean;
}

export interface CategoriaMuebleOutputDto {
    id: string;
    nombre: string;
    descripcoion: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

