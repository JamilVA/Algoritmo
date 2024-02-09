'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
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

export default function GestionEstudiantes() {
    const estudianteVacio = {
        Codigo: 0,
        FechaNacimiento: new Date(),
        CodigoPersona: 0,
        CodigoGrupo: 0,
        CodigoApoderado: 0,
        Persona: {
            Codigo: 0,
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            DNI: ''
        },
        Grupo: {
            Nombre: ''
        }
    };

    const [estudiantes, setEstudiantes] = useState<(typeof estudianteVacio)[]>([]);
    const [estudiante, setEstudiante] = useState(estudianteVacio);
    const [estudianteDialog, setEstudianteDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/api/estudiante', {});
                const { estudiantes } = data;
                console.log('Hola', estudiantes);
                setEstudiantes(estudiantes);
            } catch (error) {
                console.error(error);
            }
        };
        cargarDatos();
    }, []);

    const openNew = () => {
        setEstudiante(estudianteVacio);
        setSubmitted(false);
        setEstudianteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstudianteDialog(false);
    };


    const saveProduct = () => {
        // setSubmitted(true);
        // if (product.name.trim()) {
        //     let _products = [...(products as any)];
        //     let _product = { ...product };
        //     if (product.id) {
        //         const index = findIndexById(product.id);
        //         _products[index] = _product;
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Updated',
        //             life: 3000
        //         });
        //     } else {
        //         _product.id = createId();
        //         _product.image = 'product-placeholder.svg';
        //         _products.push(_product);
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Created',
        //             life: 3000
        //         });
        //     }
        //     setProducts(_products as any);
        //     setEstudianteDialog(false);
        //     setProduct(emptyProduct);
        // }
    };

    const editProduct = (estudiante: typeof estudianteVacio) => {
        setEstudiante({ ...estudiante });
        setEstudianteDialog(true);
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

    const nombresBodyTemplate = (rowData: typeof estudianteVacio) => {
        return rowData.Persona.Nombres + ' ' + rowData.Persona.ApellidoPaterno + ' ' + rowData.Persona.ApellidoMaterno;
    };

    const DNIBodyTemplate = (rowData: typeof estudianteVacio) => {
        return rowData.Persona.DNI;
    };

    const gradoBodyTemplate = (rowData: typeof estudianteVacio) => {
        return rowData.Grupo.Nombre;
    };


    const actionBodyTemplate = (rowData: typeof estudianteVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de Estudiantes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const estudianteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveProduct} />
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
                        value={estudiantes}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} estudiantes"
                        globalFilter={globalFilter}
                        emptyMessage="No data found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Persona.Nombres" header="Nombres Completos" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="Persona.DNI" header="DNI" sortable body={DNIBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Grupo.Nombre" header="Grado" sortable body={gradoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={estudianteDialog} style={{ width: '600px' }} header="Datos del Estudiante" modal className="p-fluid" footer={estudianteDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Persona.Nombres" className="font-bold">
                                Nombres
                            </label>
                            <InputText id="Persona.Nombres" value={estudiante.Persona.Nombres} required autoFocus maxLength={60} className={classNames({ 'p-invalid': submitted && !estudiante.Persona.Nombres })} />
                            {submitted && !estudiante.Persona.Nombres && <small className="p-error">Ingrese los nombres del estudiante.</small>}
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.ApeliidoPaterno" className="font-bold">
                                    Apellido Paterno
                                </label>
                                <InputText id="Persona.ApellidoPaterno" value={estudiante.Persona.ApellidoPaterno} required  maxLength={45} className={classNames({ 'p-invalid': submitted && !estudiante.Persona.ApellidoPaterno })} />
                                {submitted && !estudiante.Persona.ApellidoPaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.ApellidoMaterno" className="font-bold">
                                    Apellido Materno
                                </label>
                                <InputText id="Persona.ApellidoMaterno" value={estudiante.Persona.ApellidoMaterno} required  maxLength={45} className={classNames({ 'p-invalid': submitted && !estudiante.Persona.ApellidoPaterno })} />
                                {submitted && !estudiante.Persona.ApellidoMaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                        </div>

                    </Dialog>
                </div>
            </div>
        </div>
    );
}
