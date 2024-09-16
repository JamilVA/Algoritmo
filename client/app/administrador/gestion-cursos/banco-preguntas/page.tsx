'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadFilesEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import axios from 'axios';

import { useSearchParams } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';

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
            Nombre: ''
        },
        Docente: {
            Codigo: 0,
            Persona: {
                Nombres: '',
                ApellidoPaterno: '',
                ApellidoMaterno: ''
            }
        }
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
        CodigoTema: 0,
        Respuesta: []
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
    const [respuesta1, setRespuesta1] = useState(respuestaVacia);
    const [respuesta2, setRespuesta2] = useState(respuestaVacia);
    const [respuesta3, setRespuesta3] = useState(respuestaVacia);
    const [respuesta4, setRespuesta4] = useState(respuestaVacia);
    const [respuesta5, setRespuesta5] = useState(respuestaVacia);

    const [curso, setCurso] = useState(cursoVacio);
    const [tema, setTema] = useState(temaVacio);
    const [pregunta, setPregunta] = useState(preguntaVacia);

    const [temaDialog, setTemaDialog] = useState(false);
    const [preguntasDialog, setPreguntasDialog] = useState(false);
    const [newPreguntaDialog, setNewPreguntaDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('.');
    const [imagenURL, setImagenURL] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const op = useRef<OverlayPanel>(null);

    useEffect(() => {
        cargarTemas(codigoCurso);
    }, []);

    const cargarTemas = async (CodigoCurso: any) => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/pregunta/cargarTemas', {
                params: { CodigoCurso }
            });
            const { curso, temas } = data;
            setCurso(curso);
            setTemas(temas);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarPreguntas = async (CodigoTema: number) => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/pregunta/cargarPreguntas', {
                params: { CodigoTema }
            });
            const { preguntas } = data;
            console.log('Preguntas', data);
            setPreguntas(preguntas);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerArchivo = async (ruta: string) => {
        if (ruta === '') {
            return;
        }
        try {
            const response = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/files/download', {
                params: { fileName: ruta },
                responseType: 'arraybuffer' // Especificar el tipo de respuesta como 'arraybuffer'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);

            setImagenURL(url);
        } catch (error) {
            // console.error('Error al obtener el archivo:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error de carga de archivo',
                life: 3000
            });
        }
    };

    const openNew = () => {
        setTema(temaVacio);
        setSubmitted(false);
        setTemaDialog(true);
    };

    const openNewPregunta = () => {
        setPregunta(preguntaVacia);
        setNewPreguntaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTemaDialog(false);
    };

    const hidePreguntasDialog = () => {
        setPreguntasDialog(false);
    };

    const exportarCursos = () => {};

    const guardarPregunta = async () => {
        let _pregunta = { ...pregunta };

        console.log('Crear pregunta', pregunta);
        console.log('Add Respuestas', respuesta1, respuesta2, respuesta3, respuesta4, respuesta5);

        await axios
            .post('https://back.colegiosalgoritmo.edu.pe/api/pregunta/crearPregunta', {
                CodigoTema: tema.Codigo,
                pregunta: _pregunta,
                respuestas: [respuesta1, respuesta2, respuesta3, respuesta4, respuesta5]
            })
            .then((response) => {
                console.log(response.data);
                cargarPreguntas(tema.Codigo);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Operacion exitosa',
                    detail: response.data.message,
                    life: 3000
                });
                setNewPreguntaDialog(false);
                setPregunta(preguntaVacia);
                setRespuesta1(respuestaVacia);
                setRespuesta2(respuestaVacia);
                setRespuesta3(respuestaVacia);
                setRespuesta4(respuestaVacia);
                setRespuesta5(respuestaVacia);
            })
            .catch((error) => {
                console.error(error.response);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Operacion fallida',
                    detail: 'Ha ocurrido un error al procesar la solicitud',
                    life: 3000
                });
            });
    };

    const eliminarPregunta = async (CodigoPregunta: number) => {
        await axios
            .post('https://back.colegiosalgoritmo.edu.pe/api/pregunta/eliminarPregunta', {
                CodigoPregunta: CodigoPregunta
            })
            .then((response) => {
                console.log(response.data);
                cargarPreguntas(tema.Codigo);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Operacion exitosa',
                    detail: response.data.message,
                    life: 3000
                });
            })
            .catch((error) => {
                console.error(error.response);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Operacion fallida',
                    detail: 'Ha ocurrido un error al procesar la solicitud',
                    life: 3000
                });
            });
    };

    const modificarRuta = async (pregunta: any) => {
        await axios
            .put('https://back.colegiosalgoritmo.edu.pe/api/pregunta/imagenPregunta', {
                pregunta
            })
            .then((response) => {
                cargarPreguntas(pregunta.CodigoTema);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: response.data.message,
                    life: 3000
                });
            })
            .catch((error) => {
                // console.error(error)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message,
                    life: 3000
                });
            });
    };

    const handleUpload = async (event: FileUploadFilesEvent, rowData: any) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
        await axios
            .post('https://back.colegiosalgoritmo.edu.pe/api/files/upload', formData)
            .then((response) => {
                // console.log(response.data.path)
                let _pregunta = { ...rowData, RutaImagen: response.data.filename };
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'File Uploaded' });
                modificarRuta(_pregunta);
                // setActividad(emptyActividad);
            })
            .catch((error) => {
                console.error(error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error de petición' });
            });
    };

    const guardarTema = () => {
        let _tema = { ...tema };
        console.log('Tema a guardar:', _tema);

        setSubmitted(true);

        if (_tema.Codigo == 0) {
            try {
                console.log('crear');
                axios
                    .post('https://back.colegiosalgoritmo.edu.pe/api/pregunta', {
                        Descripcion: _tema.Descripcion,
                        CodigoCurso: codigoCurso
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Tema creado correctamente', life: 3000 });
                        cargarTemas(codigoCurso);
                    });
                setTema(temaVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Operacion fallida',
                    detail: 'Ha ocurrido un error al procesar la solicitud',
                    life: 3000
                });
            }
        } else {
            try {
                axios
                    .put('https://back.colegiosalgoritmo.edu.pe/api/pregunta', {
                        Codigo: _tema.Codigo,
                        Descripcion: _tema.Descripcion
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Tema modificado correctamente', life: 3000 });
                        cargarTemas(codigoCurso);
                    });
                setTema(temaVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Operacion fallida',
                    detail: 'Ha ocurrido un error al procesar la solicitud',
                    life: 3000
                });
            }
        }
    };

    const editarTema = (tema: typeof temaVacio) => {
        setTema({ ...tema });
        setTemaDialog(true);

        console.log('Tema recibido para editar:', tema);
    };

    const verPreguntas = (tema: typeof temaVacio) => {
        cargarPreguntas(tema.Codigo);
        setTema(tema);
        setPreguntasDialog(true);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';

        let _tema = { ...tema };

        _tema['Descripcion'] = val;

        setTema(_tema);
    };

    const onPreguntaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';

        let _pregunta = { ...pregunta };

        _pregunta['Descripcion'] = val;

        setPregunta(_pregunta);
    };

    const onRespuestaChange = (e: React.ChangeEvent<HTMLInputElement>, respuesta: number) => {
        const val = e.target.value || '';

        switch (respuesta) {
            case 1:
                setRespuesta1({ ...respuesta1, Valor: val, Tipo: true });
                break;
            case 2:
                setRespuesta2({ ...respuesta2, Valor: val, Tipo: false });
                break;
            case 3:
                setRespuesta3({ ...respuesta3, Valor: val, Tipo: false });
                break;
            case 4:
                setRespuesta4({ ...respuesta4, Valor: val, Tipo: false });
                break;
            case 5:
                setRespuesta5({ ...respuesta5, Valor: val, Tipo: false });
                break;
            default:
                break;
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Lista de temas del curso</h4>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportarCursos} />
            </React.Fragment>
        );
    };

    const headerPreguntasDialog = () => {
        return <Button label="Nuevo" icon="pi pi-plus" size="small" severity="success" className=" mr-2" onClick={openNewPregunta} />;
    };

    const newPreguntaDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                text
                onClick={() => {
                    setNewPreguntaDialog(false);
                    setPregunta(preguntaVacia);
                    setRespuesta1(respuestaVacia);
                    setRespuesta2(respuestaVacia);
                    setRespuesta3(respuestaVacia);
                    setRespuesta4(respuestaVacia);
                    setRespuesta5(respuestaVacia);
                }}
            />
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarPregunta} />
        </>
    );

    const temaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarTema} />
        </>
    );

    const nombreCursoBodyTemplate = (rowData: typeof temaVacio) => {
        return rowData.Descripcion;
    };

    const actionBodyTemplate = (rowData: typeof temaVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editarTema(rowData)} />
                <Button icon="pi pi-list" rounded severity="info" outlined tooltip="Ver preguntas" className="mr-2" onClick={() => verPreguntas(rowData)} />
            </>
        );
    };

    const respuestaBodyTemplate = (rowData: typeof respuestaVacia) => {
        return rowData.Valor;
    };

    const correctaBodyTemplate = (rowData: typeof respuestaVacia) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.Tipo, 'text-red-500 pi-times-circle': !rowData.Tipo })}></i>;
    };

    const filtrarRespuestas = (Respuestas: (typeof respuestaVacia)[], Codigo: number) => {
        return Respuestas.filter((s) => s.CodigoPregunta == Codigo);
    };

    const respuestasBodyTemplate = (rowData: typeof preguntaVacia) => {
        return (
            <React.Fragment>
                <DataTable
                    ref={dt}
                    value={filtrarRespuestas(rowData.Respuesta, rowData.Codigo)}
                    header={
                        <>
                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 className="m-0">{rowData.Descripcion}</h5>
                                <span className="block mt-2 md:mt-0">
                                    <>
                                        <Button
                                            icon="pi pi-times"
                                            severity='danger'
                                            size='small'
                                            tooltip='Eliminar imagen'
                                            className='m-2'
                                            onClick={() => {
                                                eliminarPregunta(rowData.Codigo);
                                            }}
                                        />
                                    </>
                                    {!rowData.RutaImagen ? (
                                        <FileUpload
                                            chooseOptions={{ icon: 'pi pi-upload', className: 'p-2' }}
                                            chooseLabel="Imagen"
                                            mode="basic"
                                            accept="image/*"
                                            maxFileSize={5000000}
                                            customUpload
                                            uploadHandler={(e) => handleUpload(e, rowData)}
                                        />
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                icon="pi pi-image"
                                                label="Ver imagen"
                                                onClick={(e) => {
                                                    obtenerArchivo(rowData.RutaImagen);
                                                    op.current!.toggle(e);
                                                }}
                                            />
                                            <OverlayPanel ref={op}>{imagenURL && <Image src={imagenURL} zoomSrc={imagenURL} alt="Imagen referencial de la pregunta" width="80" height="80" preview />}</OverlayPanel>
                                        </>
                                    )}
                                </span>
                            </div>
                        </>
                    }
                    dataKey="Codigo"
                    emptyMessage="Este pregunta no tiene respuestas registradas."
                >
                    <Column headerStyle={{ display: 'none' }} body={respuestaBodyTemplate} style={{ minWidth: '8rem' }}></Column>
                    <Column headerStyle={{ display: 'none' }} body={correctaBodyTemplate} style={{ minWidth: '2rem' }}></Column>
                </DataTable>
                {/* <Button tooltip="Nueva Sesion" icon="pi pi-plus" className="p-button-success p-button-sm m-2" style={{ padding: '0.75em' }} onClick={() => openNew(rowData)} outlined /> */}
            </React.Fragment>
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
                        dataKey="Codigo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} temas"
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

                    <Dialog
                        visible={newPreguntaDialog}
                        style={{ width: '600px' }}
                        header="Nueva Pregunta"
                        modal
                        className="p-fluid"
                        footer={newPreguntaDialogFooter}
                        onHide={() => {
                            setNewPreguntaDialog(false);
                            setPregunta(preguntaVacia);
                        }}
                    >
                        <div className="field">
                            <label htmlFor="Descripcion" className="font-bold">
                                Pregunta:
                            </label>
                            <InputTextarea
                                id="Descripcion"
                                value={pregunta.Descripcion}
                                onChange={(e) => {
                                    onPreguntaChange(e);
                                }}
                                required
                                autoFocus
                            />
                            {submitted && !tema.Descripcion && <small className="p-error">Ingrese una descripción del tema.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Descripcion" className="font-bold">
                                Respuesta Correcta:
                            </label>
                            <InputText
                                id="respuesta1.Valor"
                                value={respuesta1.Valor ?? ''}
                                onChange={(e) => {
                                    onRespuestaChange(e, 1);
                                }}
                                required
                                autoFocus
                                maxLength={200}
                                className={classNames({ 'p-invalid': submitted && !respuesta1.Valor })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Valor" className="font-bold">
                                Respuestas Incorrectas:
                            </label>
                            <InputText
                                id="respuesta2.Valor"
                                value={respuesta2.Valor ?? ''}
                                onChange={(e) => {
                                    onRespuestaChange(e, 2);
                                }}
                                required
                                autoFocus
                                maxLength={200}
                                className={classNames({ 'p-invalid': submitted && !respuesta2.Valor })}
                            />
                            <br />
                            <br />
                            <InputText
                                id="respuesta3.Valor"
                                value={respuesta3.Valor ?? ''}
                                onChange={(e) => {
                                    onRespuestaChange(e, 3);
                                }}
                                required
                                autoFocus
                                maxLength={200}
                                className={classNames({ 'p-invalid': submitted && !respuesta3.Valor })}
                            />
                            <br />
                            <br />
                            <InputText
                                id="respuesta4.Valor"
                                value={respuesta4.Valor ?? ''}
                                onChange={(e) => {
                                    onRespuestaChange(e, 4);
                                }}
                                required
                                autoFocus
                                maxLength={200}
                                className={classNames({ 'p-invalid': submitted && !respuesta4.Valor })}
                            />
                            <br />
                            <br />
                            <InputText
                                id="respuesta5.Valor"
                                value={respuesta5.Valor ?? ''}
                                onChange={(e) => {
                                    onRespuestaChange(e, 5);
                                }}
                                required
                                autoFocus
                                maxLength={200}
                                className={classNames({ 'p-invalid': submitted && !respuesta5.Valor })}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={preguntasDialog} style={{ width: '800px' }} header={'Lista de preguntas del tema'} modal className="p-fluid" onHide={hidePreguntasDialog}>
                        <Toolbar className="mb-4" left={headerPreguntasDialog}></Toolbar>

                        <DataTable
                            ref={dt}
                            value={preguntas}
                            dataKey="Codigo"
                            header={tema.Descripcion}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} preguntas"
                            globalFilter={globalFilter}
                            emptyMessage="Este tema aún no tiene preguntas registradas."
                            responsiveLayout="scroll"
                        >
                            <Column body={respuestasBodyTemplate} headerStyle={{ display: 'none' }}></Column>
                        </DataTable>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
