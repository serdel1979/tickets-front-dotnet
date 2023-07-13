export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    email?: string;
    token?: string;
    msg?:string;
}

export interface Usuario {
    uid: string;
    name: string;
    email?: string;
}

export interface UsuarioChat {
    Id : string;
    userName : string;
    Email : string;
}

export interface UsuarioDetalle {
    id: string;
    userName: string;
    email: string;
    esAdmin: boolean;
    habilitado: boolean;
}