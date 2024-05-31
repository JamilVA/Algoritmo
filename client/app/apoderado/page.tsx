'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';

const EmptyPage = () => {
    const [hijos, setHijos] = useState([]);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            cargarDatos();
        }
    }, [status]);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/apoderado/hijos', {
                params: { CodigoApoderado: session?.user.codigoApoderado }
            });
            const { datos } = data;
            setHijos(datos);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="surface-0">
            <div className="text-900 font-bold text-6xl mb-4 text-center">Estudiantes</div>
            <div className="text-700 text-xl mb-6 text-center line-height-3">Seleccione el estudiante del cual desea ver su información</div>

            <div className="grid">
                {hijos.map((hijo:any, index) => {
                    return (
                        <div key={index} className="col-12 lg:col-4">
                            <div className="p-3 h-full">
                                <div className="shadow-2 p-3 h-full flex flex-column text-center" style={{ borderRadius: '6px' }}>
                                    <div className="text-center">
                                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                            <i className="pi pi-user text-6xl text-blue-500"></i>
                                        </span>
                                    </div>
                                    <div className="text-blue-500 font-bold text-4xl mb-2">{hijo.Nombres}</div>
                                    <div className="text-600 font-medium text-2xl">{hijo.Apellidos}</div>
                                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                    <span className="font-bold text-xl text-yellow-400 mb-2">{hijo.Grado}</span>
                                    <span className="font-medium text-600">{hijo.Nivel}</span>
                                    <br />
                                    <Link
                                        href={{
                                            pathname: '/apoderado/reportes',
                                            query: {
                                                E: hijo.Codigo
                                            }
                                        }}
                                    >
                                        <Button label="Ver más" className="p-3 w-full mt-auto" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmptyPage;
