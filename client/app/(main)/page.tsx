/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { signIn } from 'next-auth/react';
import { LayoutContext } from '../../layout/context/layoutcontext';

const LoginPage = () => {
    const [errors, setErrors] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrors('');

        const responseNextAuth = await signIn('credentials', {
            email,
            password,
            redirect: false
        });

        setLoading(false);

        if (responseNextAuth?.error) {
            setErrors(responseNextAuth.error);
        } else {
            router.push('/inicio');
            router.refresh();
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo.png`} alt="Colegios Algoritmo Logo" className="mb-5 mt-3 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-5 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-2">
                            <img src="/layout/images/usuario.png" alt="Image" height="75" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenid@!</div>
                            <span className="text-600 font-medium">Ingresa tus credenciales para continuar</span>
                        </div>

                        <form onSubmit={handleSubmit} className="p-3">
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} placeholder="Password"  className="w-full mb-5" inputClassName="w-full p-3"></Password>
                            {/* <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Recordar</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div> */}
                            <Button loading={loading} label="Login" severity="info" className="w-full btn_login" type="submit"></Button>
                            <br /> <br />
                            {errors.length > 0 && (
                                <Message
                                    style={{
                                        border: 'solid',
                                        borderWidth: '0 0 0 5px'
                                    }}
                                    className="w-full justify-content-start pt-1 pb-1"
                                    severity="error"
                                    content={errors}
                                />
                            )}{' '}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
