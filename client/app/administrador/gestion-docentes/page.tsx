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

export default function GestionDocente() {
    const docenteVacio = {
        Codigo: 0,
        CodigoPersona: 0,
        Email: "",
        Telefono: "",
        FechaNacimiento: new Date(),
        Grupo:{
            Nombre:"",
        },
        Persona: {
            Codigo: 0,
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            DNI: ''
        },
    };

    const [docentes, setDocentes] = useState<(typeof docenteVacio)[]>([]);
    const [docente, setDocente] = useState(docenteVacio);
    const [docenteDialog, setDocenteDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {

        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/docente', {});
            const { docentes } = data;
            console.log('Hola', docentes);
            setDocentes(docentes);
        } catch (error) {
            console.error(error);
        }
    };

    const openNew = () => {
        setDocente(docenteVacio);
        setSubmitted(false);
        setDocenteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDocenteDialog(false);
    };

    const guardarDocente = () => {

        let _docente = {...docente}
        console.log('Docente a guardar:', _docente)

        setSubmitted(true)

        if(!docente.Codigo){
            try {
                axios.post('http://localhost:3001/api/docente', {
                    Nombres: _docente.Persona.Nombres,
                    ApellidoPaterno: _docente.Persona.ApellidoPaterno,
                    ApellidoMaterno: _docente.Persona.ApellidoMaterno,
                    Email: _docente.Email,
                    Tefelono: _docente.Telefono,
                    DNI: _docente.Persona.DNI,
                    FechaNacimiento: _docente.FechaNacimiento,
                }).then((response) => {
                    console.log(response.data)
                    toast.current!.show({severity:'success', summary: 'Successful', detail: 'Docente creado correctamente', life: 3000});
                    cargarDatos();
                })
                setDocente(docenteVacio);
                hideDialog();
            } catch (error) {
                console.error(error)
            }
        }else{
            try {
                axios.put('http://localhost:3001/api/docente', {
                    Codigo: _docente.Codigo,
                    CodigoPersona: _docente.CodigoPersona,
                    Nombres: _docente.Persona.Nombres,
                    ApellidoPaterno: _docente.Persona.ApellidoPaterno,
                    ApellidoMaterno: _docente.Persona.ApellidoMaterno,
                    DNI: _docente.Persona.DNI,
                    FechaNacimiento: _docente.FechaNacimiento,
                }).then((response) => {
                    console.log(response.data)
                    toast.current!.show({severity:'success', summary: 'Successful', detail: 'Docente modificado correctamente', life: 3000});
                    cargarDatos();
                })
                setDocente(docenteVacio);
                hideDialog();
            } catch (error) {
                console.error(error)
            }
        }

   
    const editDocente = (docente: typeof docenteVacio) => {
        setDocente({ ...docente });
        setDocenteDialog(true);

        console.log('Edtudiante recibido para editar:', docente)
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

    const nombresBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.Persona.Nombres + ' ' + rowData.Persona.ApellidoPaterno + ' ' + rowData.Persona.ApellidoMaterno;
    };

    const DNIBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.Persona.DNI;
    };

    const actionBodyTemplate = (rowData: typeof docenteVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editDocente(rowData)} />
            </>
        );
    };

    const emailBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.Email;
    };
    const fechaNacimientoBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.FechaNacimiento.toLocaleDateString("es-ES",{
            day:"2-digit",
            month:"long",
            year:"numeric"
        });
    };

    const telefonoBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.Telefono;
    };
    const grupoNombreBodyTemplate = (rowData: typeof docenteVacio) => {
        return rowData.Grupo.Nombre;
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';

        let _docente = { ...docente };

        if (name == 'Nombres') {
            docente.Persona.Nombres = val;
        }
        if (name == 'Paterno') {
            _docente.Persona.ApellidoPaterno = val;
        }
        if (name == 'Materno') {
            _docente.Persona.ApellidoMaterno = val;
        }
        if (name == 'DNI') {
            _docente.Persona.DNI = val;
        }
        if (name == 'EMAIL') {
            _docente.Email = val;
        }
        if (name == 'TELEFONO') {
            _docente.Telefono = val;
        }

        setDocente(_docente);
    };

    const onCalendarChange = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _docente = { ...docente };

        docente.FechaNacimiento = val;

        setDocente(_docente);
        console.log('Docente recibido', _docente);
    };

  

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de Docentes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const docenteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarDocente} />
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
                        value={docentes}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} docentes"
                        globalFilter={globalFilter}
                        emptyMessage="No data found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Persona.Nombres" header="Nombres Completos" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="Persona.DNI" header="DNI" sortable body={DNIBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        {/* <Column field="FechaNacimiento" header="Fecha de Nacimiento" sortable body={fechaNacimientoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column> */}
                        <Column field="Telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Grupo.Nombre" header="Tutor de" sortable body={grupoNombreBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={docenteDialog} style={{ width: '600px' }} header="Datos del Docente" modal className="p-fluid" footer={docenteDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Persona.Nombres" className="font-bold">
                                Nombres
                            </label>
                            <InputText
                                id="Persona.Nombres"
                                value={docente.Persona.Nombres}
                                onChange={(e) => {
                                    onInputChange(e, 'Nombres');
                                }}
                                required
                                autoFocus
                                maxLength={60}
                                className={classNames({ 'p-invalid': submitted && !docente.Persona.Nombres })}
                            />
                            {submitted && !docente.Persona.Nombres && <small className="p-error">Ingrese los nombres del docente.</small>}
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.ApeliidoPaterno" className="font-bold">
                                    Apellido Paterno
                                </label>
                                <InputText
                                    id="Persona.ApellidoPaterno"
                                    value={docente.Persona.ApellidoPaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Paterno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !docente.Persona.ApellidoPaterno })}
                                />
                                {submitted && !docente.Persona.ApellidoPaterno && <small className="p-error">Ingrese el apellido paterno del docente.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.ApellidoMaterno" className="font-bold">
                                    Apellido Materno
                                </label>
                                <InputText
                                    id="Persona.ApellidoMaterno"
                                    value={docente.Persona.ApellidoMaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Materno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !docente.Persona.ApellidoPaterno })}
                                />
                                {submitted && !docente.Persona.ApellidoMaterno && <small className="p-error">Ingrese el apellido paterno del docente.</small>}
                            </div>
                        </div>

                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.DNI" className="font-bold">
                                    DNI
                                </label>
                                <InputText
                                    id="Persona.DNI"
                                    value={docente.Persona.DNI}
                                    onChange={(e) => {
                                        onInputChange(e, 'DNI');
                                    }}
                                    required
                                    maxLength={8}
                                    className={classNames({ 'p-invalid': submitted && !docente.Persona.DNI })}
                                />
                                {submitted && !docente.Persona.DNI && <small className="p-error">Ingrese el DNI del docente.</small>}
                            </div>
                            {/* <div className="field col">
                                <label htmlFor="FechaNacimiento" className="font-bold">
                                    Fecha Nacimiento
                                </label>
                                <Calendar
                                    id="FechaNacimiento"
                                    value={docente.FechaNacimiento}
                                    onChange={(e) => {
                                        onCalendarChange(e);
                                    }}
                                    showIcon
                                    required
                                    className={classNames({ 'p-invalid': submitted && !docente.FechaNacimiento })}
                                />
                                {submitted && !docente.Persona.ApellidoMaterno && <small className="p-error">Seleccione la fecha de nacimiento del docente.</small>}
                            </div> */}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
      );
    }   
}