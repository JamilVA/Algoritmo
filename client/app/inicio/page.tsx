/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { signIn, useSession } from 'next-auth/react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import axios from 'axios';

const HomePage = () => {
    const [errors, setErrors] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const usuarioVacio = {
        Nombres: '',
        TipoUsuario: '',
    }

    const [usuario, setUsuario] = useState(usuarioVacio);

    const { data: session, status } = useSession();

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const cargarDatos = async () => {
        const { data } = await axios.get('http://localhost:3001/api/info', {
            params: { CodigoPersona: session?.user.codigoPersona }
        });
        const { usuario } = data;
        console.log('Hola', usuario);
        setUsuario(usuario);
    };

    useEffect(() => {
        if (status === 'authenticated') {
            cargarDatos();
        }
    }, [status]);

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="">
                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(45deg, #052490, #2079fa)',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-7xl font-bold text-900 text-white line-height-2">
                            <span className="font-normal block">COLEGIOS </span>ALGORITMO
                        </h1>
                        <p className="font-normal text-3xl line-height-3 md:mt-3 text-700 text-white">¡ Te preparamos para el éxito !</p>
                    </div>
                    <div className="flex justify-content-center md:justify-content-end">
                        <img src="/demo/images/landing/alumnos.png" alt="Hero Image" className="w-9 md:w-auto" />
                    </div>
                </div>

                <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div
                            className="col-12 mt-8 mb-8 p-2 md:p-8"
                            style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)'
                            }}
                        >
                            <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                <h3 className="text-gray-900 mb-2">{usuario.Nombres}</h3>
                                <span className="text-gray-600 text-2xl">{usuario?.TipoUsuario}</span>
                                <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                    Colegios Algoritmo te da la bienvenida a su Sistema Académico
                                </p>
                                <img src="/layout/images/logo.png" className="mt-4" alt="Colegios Algoritmo Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
