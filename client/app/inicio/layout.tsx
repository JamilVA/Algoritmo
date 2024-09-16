import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
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
        url: 'https://sia.colegiosalgoritmo.edu.pe/',
        description: 'Un colegio con alto nivel académico.',
        images: ['/layout/images/logo.png'],
        ttl: 300
    },
    icons: {
        icon: '/layout/images/logo.png'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
