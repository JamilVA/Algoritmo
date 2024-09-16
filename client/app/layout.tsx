'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import SessionAutProvider from './context/SessionAuthProvider';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}


export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
                <title>Colegios Algoritmo</title>
                <link rel="icon" href="/layout/images/logo.png" />
            </head>
            <body>
                <SessionAutProvider>
                    <PrimeReactProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </PrimeReactProvider>
                </SessionAutProvider>
            </body>
        </html>
    );
}
