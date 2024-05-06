export { default } from "next-auth/middleware";

//Especifica las rutas que se van a proteger
export const config = {
    matcher: [
        "/inicio",
        "/administrador/:path*", 
        "/docente/:path*",
        "/estudiante/:path*",
        "/apoderado/:path*",
        "/perfil/:path*",
    ]
}