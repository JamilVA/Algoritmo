/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { signIn, signOut, useSession } from "next-auth/react";
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import FloatUserCard from '@/app/components/FloatUserCard';
import { Button } from 'primereact/button';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const [closeSessionDialog, setCloseSessionDialog] = useState(false);
    const op = useRef<OverlayPanel>(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const openCloseSessionDialog = () => {
        setCloseSessionDialog(true);
    };

    const hideCloseSessionDialog = () => {
        setCloseSessionDialog(false);
    };

    const closeSessionDialogFooter = (
        <>
            <Button label="No" outlined icon="pi pi-times" onClick={hideCloseSessionDialog} />
            <Button label="Si" icon="pi pi-check" onClick={() => signOut()} />
        </>
    );

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo.png`} width="40px" height={'50px'} alt="logo" />
                <span>ALGORITMO</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <button onClick={openCloseSessionDialog} className="p-link layout-topbar-button">
                    <i className="pi pi-power-off"></i>
                    <span style={{ color: '#002479' }}>Cerrar sesión</span>
                </button>
            </div>
            <Dialog visible={closeSessionDialog} style={{ width: '400px' }} header="Confirmar" modal footer={closeSessionDialogFooter} onHide={hideCloseSessionDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {<span>¿Estás seguro de cerrar la sesión?</span>}
                </div>
            </Dialog>

            <OverlayPanel id="card" style={{ width: '300px' }} ref={op} showCloseIcon>
                <FloatUserCard></FloatUserCard>
            </OverlayPanel>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
