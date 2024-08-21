import { Metadata } from 'next';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Colegios Algoritmo',
    description: 'Un colegio con alto nivel académico.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Colegios Algoritmo',
        url: 'https://colegiosalgoritmo.edu.pe/',
        description: 'Un colegio con alto nivel académico.',
        images: ['/layout/images/logo.png'],
        ttl: 300
    },
    icons: {
        icon: '/layout/images/logo.png'
    }
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}
