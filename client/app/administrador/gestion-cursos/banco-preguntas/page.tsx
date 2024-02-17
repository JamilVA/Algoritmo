'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import axios from 'axios';

import { useSearchParams } from 'next/navigation';


export default function BancoPreguntas() {
    const searchParams = useSearchParams();
    const codigoCurso = searchParams.get('codigoCurso');

    const cursoVacio = {
        Codigo: 0,
        CodigoGrado: 0,
        CodigoDocente: 0,
        Nombre: '',
        Grado: {
            Codigo: 0,
            Nombre: '',
        }
    };

    const nivelVacio = {
        Codigo: 0,
        Nombre: '',
    }

    const [niveles, setNiveles] = useState<(typeof nivelVacio)[]>([]);
    const [cursos, setCursos] = useState<(typeof cursoVacio)[]>([]);
    const [nivel, setNivel] = useState(nivelVacio);
    const [cursoDialog, setCursoDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);


    useEffect(() => {
        console.log('x')
        cargarNiveles();
    }, []);

    const cargarNiveles = async () => {
        console.log('Hola');
        try {
            const { data } = await axios.get('http://localhost:3001/api/curso/niveles');
            const { niveles } = data;
            console.log('Hola', data);
            setNiveles(niveles);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarCursos = async (CodigoNivel: number) => {
        console.log('CodigoRecibido', CodigoNivel)
        try {
            const { data } = await axios.get('http://localhost:3001/api/curso', {
                params: { CodigoNivel: CodigoNivel }
            });
            const { cursos } = data;
            console.log('Hola', cursos);
            setCursos(cursos);
        } catch (error) {
            console.error(error);
        }
    };

    const openNew = () => {
        // setCurso(apoderadoVacio);
        // setSubmitted(false);
        // setCursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCursoDialog(false);
    };

    const exportarCursos = () => {};

    const guardarCurso = () => {};

    const editarCurso = (rowData: typeof cursoVacio) => {};

    const onDropdownChange = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _nivel = { ...nivel };

        _nivel['Codigo'] = val;

        setNivel(_nivel);
        cargarCursos(val);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Lista de Cursos</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <div className="field col">
                    <Dropdown
                        value={nivel.Codigo}
                        options={niveles}
                        optionLabel="Nombre"
                        optionValue="Codigo"
                        name="Prerequisito"
                        onChange={(e) => {
                            onDropdownChange(e);
                        }}
                        placeholder="Seleccione un nivel"
                        id="Prerequisito"
                        required
                    />
                </div>{' '}
            </span>
        </div>
    );

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
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportarCursos} />
            </React.Fragment>
        );
    };

    const cursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={guardarCurso} />
            <Button label="Guardar" icon="pi pi-check" text onClick={hideDialog} />
        </>
    );

    const nombreCursoBodyTemplate = (rowData: typeof cursoVacio) => {
        return rowData.Nombre;
    };

    const docenteBodyTemplate = (rowData: typeof cursoVacio) => {
        return rowData.CodigoDocente ? rowData.CodigoDocente : 'No Asignado';
    };

    const gradoBodyTemplate = (rowData: typeof cursoVacio) => {
        return rowData.Grado.Nombre;
    };



    const actionBodyTemplate = (rowData: typeof cursoVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editarCurso(rowData)} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h1>Curso x{}</h1>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={cursos}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cursos"
                        globalFilter={globalFilter}
                        emptyMessage="Seleccione un nivel para cargar los cursos."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Nombre" header="Curso" sortable body={nombreCursoBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="CodigoDocente" header="Docente" sortable body={docenteBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column field="Grado.Nombre" header="Grado" sortable body={gradoBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={cursoDialog} style={{ width: '600px' }} header="Datos del Apoderado" modal className="p-fluid" footer={cursoDialogFooter} onHide={hideDialog}>
                        {/* <div className="field">
                            <label htmlFor="Persona.Nombres" className="font-bold">
                                Nombres
                            </label>
                            <InputText id="Persona.Nombres" value={apoderado.Persona.Nombres} required autoFocus maxLength={60} className={classNames({ 'p-invalid': submitted && !apoderado.Persona.Nombres })} />
                            {submitted && !apoderado.Persona.Nombres && <small className="p-error">Ingrese los nombres del apoderado.</small>}
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.ApeliidoPaterno" className="font-bold">
                                    Apellido Paterno
                                </label>
                                <InputText id="Persona.ApellidoPaterno" value={apoderado.Persona.ApellidoPaterno} required maxLength={45} className={classNames({ 'p-invalid': submitted && !apoderado.Persona.ApellidoPaterno })} />
                                {submitted && !apoderado.Persona.ApellidoPaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.ApellidoMaterno" className="font-bold">
                                    Apellido Materno
                                </label>
                                <InputText id="Persona.ApellidoMaterno" value={apoderado.Persona.ApellidoMaterno} required maxLength={45} className={classNames({ 'p-invalid': submitted && !apoderado.Persona.ApellidoPaterno })} />
                                {submitted && !apoderado.Persona.ApellidoMaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                        </div> */}
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
