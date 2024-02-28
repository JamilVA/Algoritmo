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
    };

    const temaVacio = {
        Codigo: 0,
        Descripcion: '',
        CodigoCurso: 0
    };

    const preguntaVacia = {
        Codigo: 0,
        Descripcion: '',
        RutaImagen: '',
        CodigoTema: 0
    };

    const respuestaVacia = {
        Codigo: 0,
        Tipo: false,
        Valor: '',
        CodigoPregunta: 0
    };

    const [temas, setTemas] = useState<(typeof temaVacio)[]>([]);
    const [preguntas, setPreguntas] = useState<(typeof preguntaVacia)[]>([]);
    const [respuestas, setRespuestas] = useState<(typeof respuestaVacia)[]>([]);

    const [curso, setCurso] = useState(cursoVacio);
    const [tema, setTema] = useState(temaVacio);
    const [pregunta, setPregunta] = useState(preguntaVacia);
    const [respuesta, setRespuesta] = useState(respuestaVacia);
    const [temaDialog, setTemaDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        console.log('x');
        cargarPreguntas(codigoCurso);
    }, []);

    const cargarPreguntas = async (CodigoCurso: any) => {
        console.log('Hola');
        try {
            const { data } = await axios.get('http://localhost:3001/api/pregunta', {
                params: { CodigoCurso }
            });
            const { curso, temas } = data;
            console.log('Hola', data);
            setCurso(curso);
            setTemas(temas);
        } catch (error) {
            console.error(error);
        }
    };

    const funcionPrueba = () => {

    }
   
    const openNew = () => {
        setTema(temaVacio);
        setSubmitted(false);
        setTemaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTemaDialog(false);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';

        let _tema = { ...tema };

        _tema['Descripcion'] = val;

        setTema(_tema);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Lista de examenes</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <div className="field col">
                    {/* <Dropdown
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
                    /> */}
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
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={funcionPrueba} />
            </React.Fragment>
        );
    };

    const temaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={funcionPrueba} />
        </>
    );

    const nombreCursoBodyTemplate = (rowData: typeof temaVacio) => {
        return rowData.Descripcion;
    };


    const actionBodyTemplate = (rowData: typeof temaVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => funcionPrueba()} />
                <Button icon="pi pi-list" rounded severity="info" outlined tooltip="Ver preguntas" className="mr-2" onClick={() => funcionPrueba()} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h1>Curso: {curso?.Nombre}</h1>
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={temas}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} examenes"
                        globalFilter={globalFilter}
                        emptyMessage="Este curso aún no tiene temas registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Descripcion" header="Tema" sortable body={nombreCursoBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={temaDialog} style={{ width: '600px' }} header="Información del tema" modal className="p-fluid" footer={temaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Descripcion" className="font-bold">
                                Descripción:
                            </label>
                            <InputTextarea
                                id="Descripcion"
                                value={tema.Descripcion}
                                onChange={(e) => {
                                    onInputChange(e);
                                }}
                                required
                                autoFocus
                                maxLength={100}
                                className={classNames({ 'p-invalid': submitted && !tema.Descripcion })}
                            />
                            {submitted && !tema.Descripcion && <small className="p-error">Ingrese una descripción del tema.</small>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
