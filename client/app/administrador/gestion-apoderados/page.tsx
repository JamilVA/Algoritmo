'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import axios from 'axios';

export default function GestionApoderado() {
    const apoderadoVacio = {
        Codigo: 0,
        CodigoPersona: 0,
        Email: '',
        Telefono: '',
        Grupo: {
            Nombre: ''
        },
        Persona: {
            Codigo: 0,
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            DNI: ''
        }
    };

    const [apoderados, setApoderados] = useState<(typeof apoderadoVacio)[]>([]);
    const [apoderado, setApoderado] = useState(apoderadoVacio);
    const [apoderadoDialog, setApoderadoDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/apoderado', {});
            const { apoderados } = data;
            console.log('Hola', apoderados);
            setApoderados(apoderados);
        } catch (error) {
            console.error(error);
        }
    };

    const openNew = () => {
        setApoderado(apoderadoVacio);
        setSubmitted(false);
        setApoderadoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setApoderadoDialog(false);
    };

    const guardarApoderado = () => {
        let _apoderado = { ...apoderado };
        console.log('Apoderado a guardar:', _apoderado);

        setSubmitted(true);

        if (!apoderado.Codigo) {
            try {
                axios
                    .post('http://localhost:3001/api/apoderado', {
                        Nombres: _apoderado.Persona.Nombres,
                        ApellidoPaterno: _apoderado.Persona.ApellidoPaterno,
                        ApellidoMaterno: _apoderado.Persona.ApellidoMaterno,
                        Email: _apoderado.Email,
                        Tefelono: _apoderado.Telefono,
                        DNI: _apoderado.Persona.DNI
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Apoderado creado correctamente', life: 3000 });
                        cargarDatos();
                    });
                setApoderado(apoderadoVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                axios
                    .put('http://localhost:3001/api/apoderado', {
                        Codigo: _apoderado.Codigo,
                        CodigoPersona: _apoderado.CodigoPersona,
                        Nombres: _apoderado.Persona.Nombres,
                        ApellidoPaterno: _apoderado.Persona.ApellidoPaterno,
                        ApellidoMaterno: _apoderado.Persona.ApellidoMaterno,
                        DNI: _apoderado.Persona.DNI
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Apoderado modificado correctamente', life: 3000 });
                        cargarDatos();
                    });
                setApoderado(apoderadoVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const editApoderado = (apoderado: typeof apoderadoVacio) => {
        setApoderado({ ...apoderado });
        setApoderadoDialog(true);

        console.log('Edtudiante recibido para editar:', apoderado);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nombresBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return rowData.Persona.Nombres + ' ' + rowData.Persona.ApellidoPaterno + ' ' + rowData.Persona.ApellidoMaterno;
    };

    const DNIBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return rowData.Persona.DNI;
    };

    const actionBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editApoderado(rowData)} />
            </>
        );
    };

    const emailBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return rowData.Email;
    };
    
    const telefonoBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return rowData.Telefono;
    };
    const grupoNombreBodyTemplate = (rowData: typeof apoderadoVacio) => {
        return rowData.Grupo?.Nombre;
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';

        let _apoderado = { ...apoderado };

        if (name == 'Nombres') {
            apoderado.Persona.Nombres = val;
        }
        if (name == 'Paterno') {
            _apoderado.Persona.ApellidoPaterno = val;
        }
        if (name == 'Materno') {
            _apoderado.Persona.ApellidoMaterno = val;
        }
        if (name == 'DNI') {
            _apoderado.Persona.DNI = val;
        }
        if (name == 'EMAIL') {
            _apoderado.Email = val;
        }
        if (name == 'TELEFONO') {
            _apoderado.Telefono = val;
        }

        setApoderado(_apoderado);
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de Apoderados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const apoderadoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarApoderado} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={apoderados}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} apoderados"
                        globalFilter={globalFilter}
                        emptyMessage="No data found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Persona.Nombres" header="Nombres Completos" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="Persona.DNI" header="DNI" sortable body={DNIBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Grupo.Nombre" header="Tutor de" sortable body={grupoNombreBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={apoderadoDialog} style={{ width: '600px' }} header="Datos del Apoderado" modal className="p-fluid" footer={apoderadoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Persona.Nombres" className="font-bold">
                                Nombres
                            </label>
                            <InputText
                                id="Persona.Nombres"
                                value={apoderado.Persona.Nombres}
                                onChange={(e) => {
                                    onInputChange(e, 'Nombres');
                                }}
                                required
                                autoFocus
                                maxLength={60}
                                className={classNames({ 'p-invalid': submitted && !apoderado.Persona.Nombres })}
                            />
                            {submitted && !apoderado.Persona.Nombres && <small className="p-error">Ingrese los nombres del apoderado.</small>}
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.ApeliidoPaterno" className="font-bold">
                                    Apellido Paterno
                                </label>
                                <InputText
                                    id="Persona.ApellidoPaterno"
                                    value={apoderado.Persona.ApellidoPaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Paterno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !apoderado.Persona.ApellidoPaterno })}
                                />
                                {submitted && !apoderado.Persona.ApellidoPaterno && <small className="p-error">Ingrese el apellido paterno del apoderado.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.ApellidoMaterno" className="font-bold">
                                    Apellido Materno
                                </label>
                                <InputText
                                    id="Persona.ApellidoMaterno"
                                    value={apoderado.Persona.ApellidoMaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Materno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !apoderado.Persona.ApellidoPaterno })}
                                />
                                {submitted && !apoderado.Persona.ApellidoMaterno && <small className="p-error">Ingrese el apellido paterno del apoderado.</small>}
                            </div>
                        </div>

                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.DNI" className="font-bold">
                                    DNI
                                </label>
                                <InputText
                                    id="Persona.DNI"
                                    value={apoderado.Persona.DNI}
                                    onChange={(e) => {
                                        onInputChange(e, 'DNI');
                                    }}
                                    required
                                    maxLength={8}
                                    className={classNames({ 'p-invalid': submitted && !apoderado.Persona.DNI })}
                                />
                                {submitted && !apoderado.Persona.DNI && <small className="p-error">Ingrese el DNI del apoderado.</small>}
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
