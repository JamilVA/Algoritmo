'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { useRouter } from 'next/navigation';

const GestionCursos = () => {
    const router = useRouter();

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

    const nivelVacio = {
        Codigo: 0,
        Nombre: ''
    };

    const gradoVacio = {
        Codigo: 0,
        Nombre: '',
        CodigoNivel: 0
    };
    const docenteVacio = {
        Codigo: 0,
        Persona: {
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: ''
        }
    };

    const [niveles, setNiveles] = useState<(typeof nivelVacio)[]>([]);
    const [grados, setGrados] = useState<(typeof gradoVacio)[]>([]);
    const [gradosx, setGradosx] = useState<(typeof gradoVacio)[]>([]);
    const [docentes, setDocentes] = useState<(typeof docenteVacio)[]>([]);
    const [cursos, setCursos] = useState<(typeof cursoVacio)[]>([]);
    const [nivel, setNivel] = useState(nivelVacio);
    const [grado, setGrado] = useState(gradoVacio);
    const [curso, setCurso] = useState(cursoVacio);
    const [cursoDialog, setCursoDialog] = useState(false);
    const [asignarDocenteDialog, setAsignarDocenteDialog] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/curso/niveles');
            const { niveles, grados, docentes } = data;
            console.log('Hola', data);
            setNiveles(niveles);
            setGrados(grados);
            setDocentes(docentes);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarCursos = async (CodigoGrado: number) => {
        console.log('CodigoRecibido', CodigoGrado);
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/curso', {
                params: { CodigoGrado: CodigoGrado }
            });
            const { cursos } = data;
            console.log('Hola', cursos);
            setCursos(cursos);
        } catch (error) {
            console.error(error);
        }
    };

    const guardarCurso = () => {
        let _curso = { ...curso };
        console.log('Curso a guardar:', _curso);

        setSubmitted(true);

        if (!curso.Codigo) {
            try {
                axios
                    .post('https://back.colegiosalgoritmo.edu.pe/api/curso', {
                        Nombre: _curso.Nombre,
                        CodigoGrado: _curso.CodigoGrado
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Curso creado correctamente', life: 3000 });
                        cargarCursos(grado.Codigo);
                    });
                setCurso(cursoVacio);
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
                    .put('https://back.colegiosalgoritmo.edu.pe/api/curso', {
                        Codigo: _curso.Codigo,
                        Nombre: _curso.Nombre,
                        CodigoGrado: _curso.CodigoGrado
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Curso modificado correctamente', life: 3000 });
                        cargarCursos(grado.Codigo);
                    });
                setCurso(cursoVacio);
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

    const asignarDocente = async () => {
        console.log('CursoRecibidoParaAsignar:', curso);

        setSubmitted(true);
        if (curso.CodigoDocente === null) {
            return;
        }
        hideAsignarDocenteDialog();
        await axios
            .put('https://back.colegiosalgoritmo.edu.pe/api/curso/asignarDocente', {
                Codigo: curso.Codigo,
                CodigoDocente: curso.CodigoDocente
            })
            .then((response) => {
                cargarCursos(grado.Codigo);
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

    const openNew = () => {
        setCurso(cursoVacio);
        setSubmitted(false);
        setCursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCursoDialog(false);
    };

    const exportarCursos = () => {};

    const editarCurso = (curso: typeof cursoVacio) => {
        setCurso({ ...curso });
        setCursoDialog(true);

        console.log('Edtudiante recibido para editar:', curso);
    };

    const onNivelSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _nivel = { ...nivel };
        _nivel['Codigo'] = val;

        setNivel(_nivel);
        setGradosx(grados.filter((g) => g.CodigoNivel == val));
        console.log('Nivel:', val);
        console.log('Grados:', grados);
        console.log(
            'Filtados',
            grados.filter((g) => g.CodigoNivel == val)
        );
    };

    const onGradoxSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _grado = { ...grado };
        _grado['Codigo'] = val;

        setGrado(_grado);
        cargarCursos(val.Codigo);
    };

    const onGradoSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _curso = { ...curso };

        _curso['CodigoGrado'] = val;
        // _curso['Grado'] = val;

        setCurso(_curso);
    };

    const onDocenteSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _curso = { ...curso };

        _curso['CodigoDocente'] = val.Codigo;
        _curso['Docente'] = val;

        setCurso(_curso);
        console.log('Docente asignado a', _curso);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = (e.target && e.target.value) || '';

        let _curso = { ...curso };

        _curso['Nombre'] = val;

        setCurso(_curso);
    };

    const openAsignarDocente = (curso: typeof cursoVacio) => {
        setSubmitted(false);
        setAsignarDocenteDialog(true);
        setCurso(curso);
    };

    const hideAsignarDocenteDialog = () => {
        setSubmitted(false);
        setAsignarDocenteDialog(false);
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
                        name="Nivel"
                        onChange={(e) => {
                            onNivelSelect(e);
                        }}
                        placeholder="Seleccione un nivel"
                        id="Nivel"
                        required
                        className="mr-2"
                    />
                    <Dropdown
                        value={grado.Codigo}
                        options={gradosx}
                        optionLabel="Nombre"
                        optionValue="Codigo"
                        name="Grado"
                        onChange={(e) => {
                            onGradoxSelect(e);
                        }}
                        placeholder="Seleccione un grado"
                        id="Grado"
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
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportarCursos} />
            </React.Fragment>
        );
    };

    const cursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarCurso} />
        </>
    );

    const asignarDocenteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideAsignarDocenteDialog} />
            <Button label="Asignar" icon="pi pi-check" text onClick={asignarDocente} />
        </>
    );

    const nombreCursoBodyTemplate = (rowData: typeof cursoVacio) => {
        return rowData.Nombre;
    };

    // const docenteBodyTemplate = (rowData: typeof cursoVacio) => {
    //     return rowData.CodigoDocente ? rowData.CodigoDocente : 'No Asignado';
    // };

    const docenteBodyTemplate = (rowData: typeof cursoVacio) => {
        let docente = rowData.Docente?.Persona?.Nombres + ' ' + rowData.Docente?.Persona?.ApellidoPaterno + ' ' + rowData.Docente?.Persona?.ApellidoPaterno;
        return (
            <div className="flex align-content-center">
                <div className="flex align-items-center justify-content-center">
                    <p>{!rowData.Docente ? '' : docente}</p>
                </div>
                <div className="flex align-items-center justify-content-center">
                    <Button icon="pi pi-user" rounded text severity="secondary" onClick={() => openAsignarDocente(rowData)} tooltip={rowData.CodigoDocente ? 'Reasignar docente' : 'Asignar docente'} />
                </div>
            </div>
        );
    };

    const gradoBodyTemplate = (rowData: typeof cursoVacio) => {
        return rowData.Grado?.Nombre;
    };

    const bancoPreguntas = (rowData: any) => {
        const codigoCurso = rowData.Codigo;

        // router.push({
        //     pathname: '/administrador/gestion-cursos/banco-preguntas',
        //     query: {
        //         codigoCurso,
        //     }
        // });

        router.push(`/administrador/gestion-cursos/banco-preguntas?codigoCurso=${codigoCurso}`);
    };

    const actionBodyTemplate = (rowData: typeof cursoVacio) => {
        return (
            <>
                <Button icon="pi pi-book" rounded severity="help" outlined tooltip="Banco de preguntas" className="mr-2" onClick={() => bancoPreguntas(rowData)} />
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editarCurso(rowData)} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
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

                    <Dialog visible={cursoDialog} style={{ width: '600px' }} header="Datos del Curso" modal className="p-fluid" footer={cursoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Nombre" className="font-bold">
                                Nombre del curso
                            </label>
                            <InputText
                                id="Nombre"
                                value={curso.Nombre}
                                onChange={(e) => {
                                    onInputChange(e);
                                }}
                                required
                                autoFocus
                                maxLength={45}
                                className={classNames({ 'p-invalid': submitted && !curso.Nombre })}
                            />
                            {submitted && !curso.Nombre && <small className="p-error">Ingrese el nombre del curso.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Grado" className="font-bold">
                                Grado:
                            </label>
                            <Dropdown
                                value={curso.CodigoGrado}
                                onChange={(e) => {
                                    onGradoSelect(e);
                                }}
                                options={grados}
                                optionLabel="Nombre"
                                optionValue="Codigo"
                                placeholder="Seleccione grado del curso"
                            ></Dropdown>
                        </div>
                    </Dialog>

                    <Dialog visible={asignarDocenteDialog} style={{ width: '450px' }} header="Asignar o reasignar docente" modal className="p-fluid" footer={asignarDocenteDialogFooter} onHide={hideAsignarDocenteDialog}>
                        <div className="field">
                            <label htmlFor="docente">Docente</label>
                            <Dropdown
                                id="docente"
                                value={curso.Docente}
                                options={docentes}
                                optionLabel="Persona.Nombres"
                                optionValue="Codigo"
                                placeholder="Seleccione un docente"
                                onChange={(e) => onDocenteSelect(e)}
                                required
                                autoFocus
                                showClear
                                itemTemplate={(option) => <div>{`${option.Persona.Nombres} ${option.Persona.ApellidoPaterno} ${option.Persona.ApellidoMaterno}`}</div>}
                                className={classNames({
                                    'p-invalid': submitted && !curso.Docente
                                })}
                            />
                            {submitted && !curso.CodigoDocente && <small className="p-invalid">Seleccione un docente para asignarlo</small>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default GestionCursos;
