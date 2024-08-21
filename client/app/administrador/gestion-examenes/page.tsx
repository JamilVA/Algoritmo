'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { Calendar } from 'primereact/calendar';

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

    const temaVacio = {
        Codigo: 0,
        Descripcion: '',
        CodigoCurso: 0
    };

    const examenDiarioVacio = {
        Codigo: 0,
        Fecha: new Date(),
        HoraInicio: '08:00',
        HoraFin: '09:00',
        Duracion: 0,
        CodigoTema: 0,
        Tema: {
            Codigo: 0,
            Descripcion: '',
            CodigoCurso: 0
        }
    };

    const [niveles, setNiveles] = useState<(typeof nivelVacio)[]>([]);
    const [grados, setGrados] = useState<(typeof gradoVacio)[]>([]);
    const [gradosx, setGradosx] = useState<(typeof gradoVacio)[]>([]);
    const [cursos, setCursos] = useState<(typeof cursoVacio)[]>([]);
    const [temas, setTemas] = useState<(typeof temaVacio)[]>([]);
    const [examenes, setExamenes] = useState<(typeof examenDiarioVacio)[]>([]);
    const [nivel, setNivel] = useState(nivelVacio);
    const [grado, setGrado] = useState(gradoVacio);
    const [curso, setCurso] = useState(cursoVacio);
    const [examen, setExamen] = useState(examenDiarioVacio);
    const [cursoDialog, setCursoDialog] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/curso/niveles');
            const { niveles, grados } = data;
            console.log('Hola', data);
            setNiveles(niveles);
            setGrados(grados);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarExamenes = async (CodigoGrado: number) => {
        console.log('CodigoRecibido', CodigoGrado);
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen', {
                params: { CodigoGrado: CodigoGrado }
            });
            const { examenes } = data;
            console.log('Hola', examenes);
            setExamenes(examenes);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarCursos = async (CodigoGrado: number) => {
        console.log('Codigo grado Cursos', CodigoGrado);
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/cursos', {
                params: { CodigoGrado: CodigoGrado }
            });
            const { cursos } = data;
            console.log('Hola', cursos);
            setCursos(cursos);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarTemas = async (CodigoCurso: number) => {
        console.log('Codigo Curso temas', CodigoCurso);
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/temas', {
                params: { CodigoCurso: CodigoCurso }
            });
            const { temas } = data;
            console.log('Hola', temas);
            setTemas(temas);
        } catch (error) {
            console.error(error);
        }
    };

    const guardarExamen = async () => {
        console.log('Examen a guardar', examen);
        await axios
            .post('https://back.colegiosalgoritmo.edu.pe/api/examen', {
                examen: {
                    ...examen
                }
            })
            .then((response) => {
                setCursoDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: response.data.message,
                    life: 3000
                });
                cargarExamenes(grado?.Codigo);
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: !error.response ? error.message : error.response.data.error,
                    life: 3000
                });
            });
    };

    const openNew = () => {
        cargarCursos(grado?.Codigo);
        setExamen(examenDiarioVacio);
        setCursoDialog(true);
    };

    const hideDialog = () => {
        setCursoDialog(false);
    };

    const exportarCursos = () => {};

    const editarCurso = async (examen: any) => {
        setCurso({ ...curso, Codigo: examen.Tema.CodigoCurso });
        setExamen({ ...examen, Fecha: new Date(examen.Fecha) });
        await cargarCursos(examen?.Tema?.Curso.CodigoGrado);
        await cargarTemas(examen?.Tema?.CodigoCurso);

        setCursoDialog(true);
    };

    const onNivelSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _nivel = { ...nivel };

        _nivel['Codigo'] = val;

        setNivel(_nivel);
        setGradosx(grados.filter((g) => g.CodigoNivel == val));
        setGrado(gradoVacio);

        console.log('Nivel:', nivel);
        console.log('Grados:', grados);
    };

    const onGradoxSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _grado = { ...grado };

        _grado['Codigo'] = val;

        setGrado(_grado);
        cargarExamenes(val);
    };

    const onCursoSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _curso = {...curso};
        _curso['Codigo'] = val;
        setCurso(_curso);
        cargarTemas(val);
    };

    const onTemaSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _examen = {...examen};
        _examen['CodigoTema'] = val;

        setExamen(_examen);
    };

    const onCalendarChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';

        let hora = val as Date;
        let _hora;
        if (hora.getHours && hora.getMinutes) {
            _hora = hora.getHours() + ':' + hora.getMinutes();

            switch (name) {
                case 'fecha':
                    setExamen({ ...examen, Fecha: val });
                    break;
                case 'inicio':
                    setExamen({ ...examen, HoraInicio: _hora });
                    break;
                case 'fin':
                    setExamen({ ...examen, HoraFin: _hora });
                    break;
            }
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Lista de Examenes</h4>
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
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarExamen} disabled={grado.Codigo == 0} />
        </>
    );

    const temaBodyTemplate = (rowData: any) => {
        return rowData?.Tema?.Descripcion;
    };

    const cursoBodyTemplate = (rowData: any) => {
        return rowData?.Tema?.Curso?.Nombre;
    };

    const fechaBodyTemplate = (rowData: any) => {
        return formatDate(new Date(rowData?.Fecha));
    };

    const horaBodyTemplate = (rowData: any) => {
        return rowData?.HoraInicio;
    };

    const duracionBodyTemplate = (rowData: any) => {
        return rowData?.Duracion + ' min';
    };

    const formatDate = (value: Date) => {
        return value.toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editarCurso(rowData)} />
            </>
        );
    };

    const setHora = (hora: string) => {
        let strings = hora.split(':');
        let fecha = new Date();
        fecha.setHours(parseInt(strings[0], 10), parseInt(strings[1], 10));
        return fecha;
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={examenes}
                        dataKey="Codigo"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cursos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay examenes de este grado seleccionado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Tema.Curso.Nombre" header="Curso" sortable body={cursoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Tema.Descripcion" header="Tema" sortable body={temaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Fecha" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Hora" sortable body={horaBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Tiempo/Pregunta" sortable body={duracionBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog
                        visible={cursoDialog}
                        style={{ width: '600px' }}
                        header={
                            grado.Codigo == 0 || nivel.Codigo == 0 ? (
                                <>
                                    <i className="pi pi-exclamation-triangle" style={{ color: 'red' }}></i>
                                    <small className="p-error"> Seleccione nivel y grado primero.</small>
                                </>
                            ) : (
                                (nivel.Nombre ?? '(Seleccione un nivel)') + ': ' + (grado.Nombre ?? '(Seleccione un grado)')
                            )
                        }
                        modal
                        className="p-fluid"
                        footer={cursoDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Curso" className="font-bold">
                                    Curso:
                                </label>
                                <Dropdown
                                    value={curso.Codigo}
                                    onChange={(e) => {
                                        onCursoSelect(e);
                                    }}
                                    name="CodigoCurso"
                                    options={cursos}
                                    optionLabel="Nombre"
                                    optionValue="Codigo"
                                    placeholder="Seleccione el curso"
                                    emptyMessage="No hay cursos"
                                ></Dropdown>
                            </div>
                            <div className="field col">
                                <label htmlFor="Tema" className="font-bold">
                                    Tema:
                                </label>
                                <Dropdown
                                    value={examen?.CodigoTema}
                                    onChange={(e) => {
                                        onTemaSelect(e);
                                    }}
                                    options={temas}
                                    optionLabel="Descripcion"
                                    optionValue="Codigo"
                                    placeholder="Seleccione tema de examen"
                                    className={classNames({ 'p-invalid': curso.Codigo == 0 })}
                                ></Dropdown>
                                {curso.Codigo == 0 && <small className="p-error">Seleccione un curso primero.</small>}
                            </div>
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label className="font-bold">Fecha</label>
                                <Calendar
                                    value={examen.Fecha}
                                    onChange={(e) => {
                                        onCalendarChange(e, 'fecha');
                                    }}
                                    showIcon
                                    required
                                    dateFormat="dd/mm/yy"
                                    showButtonBar
                                />
                            </div>
                            <div className="field col">
                                <label className="font-bold">Tiempo por Pregunta</label>
                                <InputNumber value={examen.Duracion} onValueChange={(e) => setExamen({ ...examen, Duracion: e.value ?? 0 })} min={0} max={240} suffix=" min" />
                            </div>
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label className="font-bold">Hora de Apertura</label>
                                <Calendar
                                    value={setHora(examen.HoraInicio)}
                                    onChange={(e) => {
                                        onCalendarChange(e, 'inicio');
                                    }}
                                    showIcon
                                    required
                                    timeOnly
                                    icon={() => <i className="pi pi-clock" />}
                                />
                            </div>
                            <div className="field col">
                                <label className="font-bold">Hora de Cierre</label>
                                <Calendar
                                    value={setHora(examen.HoraFin)}
                                    onChange={(e) => {
                                        onCalendarChange(e, 'fin');
                                    }}
                                    showIcon
                                    required
                                    timeOnly
                                    icon={() => <i className="pi pi-clock" />}
                                />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default GestionCursos;
