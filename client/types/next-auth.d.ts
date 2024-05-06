import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      tipoUsuario: number;
      codigoPersona: number;
      codigoDocente: number;
      codigoApoderado: number;
      codigoEstudiante: number;
      token: string;
    };
  }
}
