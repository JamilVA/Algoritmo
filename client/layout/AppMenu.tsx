/* eslint-disable @next/next/no-img-element */

import React, { useContext, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { useSession } from 'next-auth/react';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { data: session, status } = useSession();
    const [i, setI] = useState(0);

    const initModel: AppMenuItem[] = [
        {
            label: 'NAVEGACIÓN',
            items: []
        }
    ];

    const [user, setUser] = useState(initModel);

    const modelAdministrador: AppMenuItem[] = [
        {
            label: 'PANEL DE ADMINISTRACIÓN',
            items: [
                { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/administrador' },
                { label: 'Gestion Apoderados', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-apoderados' },
                { label: 'Gestion Estudiantes', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-estudiantes' },
                { label: 'Gestion Docentes', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-docentes' },
                { label: 'Gestion Cursos', icon: 'pi pi-fw pi-fw pi-book', to: '/administrador/gestion-cursos' },
                { label: 'Gestion Examenes', icon: 'pi pi-fw pi-file-edit', to: '/administrador/gestion-examenes' }
            ]
        }
    ];

    const modelApoderado: AppMenuItem[] = [
        {
            label: 'PANEL APODERADO',
            items: [
                { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/apoderado' },
                { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/apoderado/cursos' }
            ]
        }
    ];

    const modelDocente: AppMenuItem[] = [
        {
            label: 'PANEL DOCENTE',
            items: [
                { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/docente' },
                { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/docente/cursos' }
            ]
        }
    ];

    const modelEstudiante: AppMenuItem[] = [
        {
            label: 'PANEL ESTUDIANTE',
            items: [
                { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/estudiante' },
                { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/estudiante/cursos' },
                { label: 'Examenes', icon: 'pi pi-fw pi-file', to: '/estudiante/examenes' }
            ]
        }
    ];

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },

        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        }
                    ]
                },
                {
                    label: 'Administrador',
                    items: [
                        { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/administrador' },
                        { label: 'Gestion Apoderados', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-apoderados' },
                        { label: 'Gestion Estudiantes', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-estudiantes' },
                        { label: 'Gestion Docentes', icon: 'pi pi-fw pi-users', to: '/administrador/gestion-docentes' },
                        { label: 'Gestion Cursos', icon: 'pi pi-fw pi-fw pi-book', to: '/administrador/gestion-cursos' },
                        { label: 'Gestion Examenes', icon: 'pi pi-fw pi-file-edit', to: '/administrador/gestion-examenes' }
                        // { label: 'Gestion Pagos', icon: 'pi pi-fw pi-money-bill', to: '/administrador/gestion-pagos' },
                        // { label: 'Gestion Matricula', icon: 'pi pi-fw pi-list', to: '/administrador/matricula' },
                    ]
                },
                {
                    label: 'Apoderado',
                    items: [
                        { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/apoderado' },
                        { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/apoderado/cursos' }
                        // { label: 'Asistencia', icon: 'pi pi-fw pi-check-circle', to: '/apoderado/asistencias' },
                        // { label: 'Horarios', icon: 'pi pi-fw pi-calendar-plus', to: '/apoderado/horarios' },
                        // { label: 'Pagos', icon: 'pi pi-fw pi-money-bill', to: '/apoderado/pagos' },
                    ]
                },
                {
                    label: 'Docente',
                    items: [
                        { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/docente' },
                        { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/docente/cursos' }
                    ]
                },
                {
                    label: 'Estudiante',
                    items: [
                        { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: '/estudiante' },
                        { label: 'Cursos', icon: 'pi pi-fw pi-book', to: '/estudiante/cursos' },
                        { label: 'Examenes', icon: 'pi pi-fw pi-file', to: '/estudiante/examenes' }
                        // { label: 'Horarios', icon: 'pi pi-fw pi-calendar-plus', to: '/estudiante/horarios' },
                    ]
                }
                // {
                //     label: 'Crud',
                //     icon: 'pi pi-fw pi-pencil',
                //     to: '/pages/crud'
                // }
                // {
                //     label: 'Timeline',
                //     icon: 'pi pi-fw pi-calendar',
                //     to: '/pages/timeline'
                // },
            ]
        }
    ];

    if (i == 0) {
        console.log('Hola', session?.user)
        switch (session?.user?.tipoUsuario) {
            case 1:
                setUser(modelAdministrador);
                break;
            case 2:
                setUser(modelDocente);
                break;
            case 3:
                setUser(modelEstudiante);
                break;
            case 4:
                setUser(modelApoderado);
                break;
        }
        setI(i + 1);
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );

    // return (
    //     <MenuProvider>
    //         <ul className="layout-menu">
    //             {model.map((item, i) => {
    //                 return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
    //             })}
    //         </ul>
    //     </MenuProvider>
    // );

    
};

export default AppMenu;
