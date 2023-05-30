export interface Solicitud{
    id: number,
    departamento: string,
    descripcion: string,
    equipo: string,
    estadoActual: string,
    estados: Estado[],
    fecha: Date,
    urlImagen: string,
    usuario: string,
    usuarioId: string
}

export interface Estado{
    id: number,
    estadoActual: string,
    comentario: string,
    fecha: Date
}