'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import axios from 'axios';
import { Password } from 'primereact/password';

export default function GestionEstudiante() {
    const estudianteVacio = {
        Codigo: 0,
        FechaNacimiento: new Date(),
        CodigoPersona: 0,
        CodigoGrupo: 0,
        CodigoApoderado: 0,
        Grupo: {
            Nombre: ''
        },
        Persona: {
            Codigo: 0,
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            DNI: '',
            Usuario: {
                Password: ''
            }
        },
        Apoderado: {
            Codigo: 0,
            Persona: {
                Nombres: '',
                ApellidoPaterno: '',
                ApellidoMaterno: ''
            }
        }
    };

    const apoderadoVacio = {
        Codigo: 0,
        CodigoPersona: 0,
        Direccion: '',
        Telefono: '',
        Persona: {
            Codigo: 0,
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            DNI: '',
            Usuario: {
                Password: ""
            }
        }
    };
    const grupoVacio = {
        Codigo: 0,
        Nombre: " ",
    }

    const [estudiantes, setEstudiantes] = useState<(typeof estudianteVacio)[]>([]);
    const [estudiante, setEstudiante] = useState(estudianteVacio);

    const [apoderados, setApoderados] = useState<(typeof apoderadoVacio)[]>([]);

    const [grupos, setGrupos] = useState<(typeof grupoVacio)[]>([]);
    const [grupoDialog, setGrupoDialog] = useState(false);

    const [estudianteDialog, setEstudianteDialog] = useState(false);

    const [apoderado, setApoderado] = useState(apoderadoVacio);
    const [apoderadoDialog, setApoderadoDialog] = useState(false);

    const [grupo, setGrupo] = useState(grupoVacio);

    const [submitted, setSubmitted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        cargarDatos();
        cargarApoderados();
        cargarGrupos();
    }, []);

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

    const cargarApoderados = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/apoderado', {});
            const { apoderados } = data;

            console.log('Hola', apoderados);
            setApoderados(apoderados);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarGrupos = async () => {
        console.log("aaaaa");

       const { data } = await axios.get('http://localhost:3001/api/estudiante/cargarGrados', {});
       const { grupos } = data;
       console.log("iiiiiiiiii");

        console.log('Adios', data);
        setGrupos(grupos);

    };

    const openNew = () => {
        setEstudiante(estudianteVacio);
        setSubmitted(false);
        setEstudianteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstudianteDialog(false);
    };

    const guardarEstudiante = () => {
        let _estudiante = { ...estudiante };
        console.log('Estudiante a guardar:', _estudiante);

        setSubmitted(true);

        if (!estudiante.Codigo) {
            try {
                axios
                    .post('http://localhost:3001/api/estudiante', {
                        Nombres: _estudiante.Persona.Nombres,
                        ApellidoPaterno: _estudiante.Persona.ApellidoPaterno,
                        ApellidoMaterno: _estudiante.Persona.ApellidoMaterno,
                        DNI: _estudiante.Persona.DNI,
                        Password: _estudiante.Persona.Usuario.Password,
                        FechaNacimiento: _estudiante.FechaNacimiento
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Estudiante creado correctamente', life: 3000 });
                        cargarDatos();
                    });
                setEstudiante(estudianteVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                axios
                    .put('http://localhost:3001/api/estudiante', {
                        Codigo: _estudiante.Codigo,
                        CodigoPersona: _estudiante.CodigoPersona,
                        Nombres: _estudiante.Persona.Nombres,
                        ApellidoPaterno: _estudiante.Persona.ApellidoPaterno,
                        ApellidoMaterno: _estudiante.Persona.ApellidoMaterno,
                        DNI: _estudiante.Persona.DNI,
                        FechaNacimiento: _estudiante.FechaNacimiento
                    })
                    .then((response) => {
                        console.log(response.data);
                        toast.current!.show({ severity: 'success', summary: 'Successful', detail: 'Estudiante modificado correctamente', life: 3000 });
                        cargarDatos();
                    });
                setEstudiante(estudianteVacio);
                hideDialog();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const asignarDocente = async () => {
        console.log('CursoRecibidoParaAsignar:', estudiante);

        if (estudiante.CodigoApoderado === null) {
            return;
        }

        await axios.put(
            'http://localhost:3001/api/estudiante/asignarApoderado',
            {
                Codigo: estudiante.Codigo,
                CodigoApoderado: estudiante.CodigoApoderado
            }
        ).then((response) => {
            console.log(response.data)
            cargarDatos();
            toast.current?.show({
                severity: 'success',
                summary: 'Operacion exitosa',
                detail: response.data.message,
                life: 3000
            });
            hideAsignarDocenteDialog();
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

    const asignarGrupo = async () => {
        console.log('GrupoRecibidoParaAsignar:', estudiante);

        if (estudiante.CodigoGrupo === null) {
            return;
        }

        await axios.put(
            'http://localhost:3001/api/estudiante/asignarGrado',
            {
                Codigo: estudiante.Codigo,
                CodigoGrupo: estudiante.CodigoGrupo,
            }
        ).then((response) => {
            console.log(response.data)
            cargarDatos();
            toast.current?.show({
                severity: 'success',
                summary: 'Operacion exitosa',
                detail: response.data.message,
                life: 3000
            });
            hideAsignarGrupoDialog();
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

    const editarEstudiante = (estudiante: typeof estudianteVacio) => {
        setEstudiante({ ...estudiante });
        setEstudianteDialog(true);

        console.log('Edtudiante recibido para editar:', estudiante);
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
        return (
            <div className="flex align-content-center">
                <div className="flex align-items-center justify-content-center">
                    <p>{rowData?.Grupo?.Nombre}</p>
                </div>
                <div className="flex align-items-center justify-content-center">
                    <Button icon="pi pi-list" rounded text severity="secondary" onClick={() => openAsignarGrado(rowData)} tooltip={rowData.CodigoApoderado ? 'Reasignar apoderado' : 'Asignar apoderado'} />
                </div>
            </div>
        );
    };
    const passwordBodyTemplate = (rowData: typeof estudianteVacio) => {
        return rowData.Persona?.Usuario?.Password;
    };


    const apoderadoBodyTemplate = (rowData: typeof estudianteVacio) => {
        let apoderado = rowData.Apoderado?.Persona?.Nombres + ' ' + rowData.Apoderado?.Persona?.ApellidoPaterno + ' ' + rowData.Apoderado?.Persona?.ApellidoPaterno;
        return (
            <div className="flex align-content-center">
                <div className="flex align-items-center justify-content-center">
                    <p>{!rowData.Apoderado ? '' : apoderado}</p>
                </div>
                <div className="flex align-items-center justify-content-center">
                    <Button icon="pi pi-user" rounded text severity="secondary" onClick={() => openAsignarDocente(rowData)} tooltip={rowData.CodigoApoderado ? 'Reasignar docente' : 'Asignar docente'} />
                </div>
            </div>
        );
    };

    const openAsignarDocente = (estudiante: typeof estudianteVacio) => {
        setSubmitted(false);
        setApoderadoDialog(true);
        setEstudiante(estudiante);
    };

    const openAsignarGrado = (estudiante: typeof estudianteVacio) => {
        setSubmitted(false);
        setGrupoDialog(true);
        setEstudiante(estudiante);
    };

    const hideAsignarDocenteDialog = () => {
        setSubmitted(false);
        setApoderadoDialog(false);
        setEstudiante(estudianteVacio);
    };

    const hideAsignarGrupoDialog = () => {
        setSubmitted(false);
        setGrupoDialog(false);
        setEstudiante(estudianteVacio);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';

        let _estudiante = { ...estudiante };

        if (name == 'Nombres') {
            _estudiante.Persona.Nombres = val;
        }
        if (name == 'Paterno') {
            _estudiante.Persona.ApellidoPaterno = val;
        }
        if (name == 'Materno') {
            _estudiante.Persona.ApellidoMaterno = val;
        }
        if (name == 'DNI') {
            _estudiante.Persona.DNI = val;
        }
        if (name == 'Password') {
            _estudiante.Persona.Usuario.Password = val;
        }

        setEstudiante(_estudiante);
    };

    const onCalendarChange = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let _estudiante = { ...estudiante };

        _estudiante.FechaNacimiento = val;

        setEstudiante(_estudiante);
        console.log('Estudiante recibido', _estudiante);
    };

    const onDocenteSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _estudiante = { ...estudiante };

        _estudiante['CodigoApoderado'] = val;

        setEstudiante(_estudiante);
        console.log('Docente asignado a', _estudiante);
    };

    const onGrupoSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        let _estudiante = { ...estudiante };

        _estudiante['CodigoGrupo'] = val;

        setEstudiante(_estudiante);
        console.log('Grupo asignado a', _estudiante);
    };

    const actionBodyTemplate = (rowData: typeof estudianteVacio) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="warning" outlined tooltip="Editar" className="mr-2" onClick={() => editarEstudiante(rowData)} />
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
            <Button label="Guardar" icon="pi pi-check" text onClick={guardarEstudiante} />
        </>
    );

    const asignarApoderadoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideAsignarDocenteDialog} />
            <Button label="Asignar" icon="pi pi-check" text onClick={asignarDocente} />
        </>
    );

    const asignarGrupoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideAsignarGrupoDialog} />
            <Button label="Asignar" icon="pi pi-check" text onClick={asignarGrupo} />
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
                        dataKey="Codigo"
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
                        <Column field="Persona.Usuario.Password" header="Password" sortable body={passwordBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Apoderado.Codigo" header="Apoderado" sortable body={apoderadoBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>

                    <Dialog visible={estudianteDialog} style={{ width: '600px' }} header="Datos del Estudiante" modal className="p-fluid" footer={estudianteDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="Persona.Nombres" className="font-bold">
                                Nombres
                            </label>
                            <InputText
                                id="Persona.Nombres"
                                value={estudiante.Persona.Nombres}
                                onChange={(e) => {
                                    onInputChange(e, 'Nombres');
                                }}
                                required
                                autoFocus
                                maxLength={60}
                                className={classNames({ 'p-invalid': submitted && !estudiante.Persona.Nombres })}
                            />
                            {submitted && !estudiante.Persona.Nombres && <small className="p-error">Ingrese los nombres del estudiante.</small>}
                        </div>
                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.ApeliidoPaterno" className="font-bold">
                                    Apellido Paterno
                                </label>
                                <InputText
                                    id="Persona.ApellidoPaterno"
                                    value={estudiante.Persona.ApellidoPaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Paterno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !estudiante.Persona.ApellidoPaterno })}
                                />
                                {submitted && !estudiante.Persona.ApellidoPaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.ApellidoMaterno" className="font-bold">
                                    Apellido Materno
                                </label>
                                <InputText
                                    id="Persona.ApellidoMaterno"
                                    value={estudiante.Persona.ApellidoMaterno}
                                    onChange={(e) => {
                                        onInputChange(e, 'Materno');
                                    }}
                                    required
                                    maxLength={45}
                                    className={classNames({ 'p-invalid': submitted && !estudiante.Persona.ApellidoPaterno })}
                                />
                                {submitted && !estudiante.Persona.ApellidoMaterno && <small className="p-error">Ingrese el apellido paterno del estudiante.</small>}
                            </div>
                        </div>

                        <div className="form grid">
                            <div className="field col">
                                <label htmlFor="Persona.DNI" className="font-bold">
                                    DNI
                                </label>
                                <InputText
                                    id="Persona.DNI"
                                    value={estudiante.Persona.DNI}
                                    onChange={(e) => {
                                        onInputChange(e, 'DNI');
                                    }}
                                    required
                                    maxLength={8}
                                    className={classNames({ 'p-invalid': submitted && !estudiante.Persona.DNI })}
                                />
                                {submitted && !estudiante.Persona.DNI && <small className="p-error">Ingrese el DNI del estudiante.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="Persona.Usuario.Password" className="font-bold">
                                    Password
                                </label>
                                <Password
                                    value={estudiante?.Persona?.Usuario?.Password}
                                    onChange={(e) => {
                                        onInputChange(e, 'Password');
                                    }}
                                    toggleMask
                                />
                                {submitted && !estudiante?.Persona?.Usuario?.Password && <small className="p-error">Ingrese una contraseña para estudiante.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="FechaNacimiento" className="font-bold">
                                    Fecha Nacimiento
                                </label>
                                <Calendar
                                    id="FechaNacimiento"
                                    value={estudiante.FechaNacimiento}
                                    onChange={(e) => {
                                        onCalendarChange(e);
                                    }}
                                    showIcon
                                    required
                                    className={classNames({ 'p-invalid': submitted && !estudiante.FechaNacimiento })}
                                />
                                {submitted && !estudiante.Persona.ApellidoMaterno && <small className="p-error">Seleccione la fecha de nacimiento del estudiante.</small>}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={apoderadoDialog} style={{ width: '450px' }} header="Asignar o reasignar docente" modal className="p-fluid" footer={asignarApoderadoDialogFooter} onHide={hideAsignarDocenteDialog}>
                        <div className="field">
                            <label htmlFor="docente">Docente</label>
                            <Dropdown
                                id="docente"
                                value={estudiante.CodigoApoderado}
                                options={apoderados}
                                optionLabel="Persona.Nombres"
                                optionValue="Codigo"
                                placeholder="Seleccione un docente"
                                onChange={(e) => onDocenteSelect(e)}
                                required
                                autoFocus
                                showClear
                                itemTemplate={(option) => <div>{`${option.Persona.Nombres} ${option.Persona.ApellidoPaterno} ${option.Persona.ApellidoMaterno}`}</div>}
                                className={classNames({
                                    'p-invalid': submitted && !estudiante.Apoderado
                                })}
                            />
                            {submitted && !estudiante.Apoderado && <small className="p-invalid">Seleccione un docente para asignarlo</small>}
                        </div>
                    </Dialog>
                    <Dialog visible={grupoDialog} style={{ width: '450px' }} header="Asignar o reasignar grupo" modal className="p-fluid" footer={asignarGrupoDialogFooter} onHide={hideAsignarGrupoDialog}>
                        <div className="field">
                            <label htmlFor="Estudiante">Grupo</label>
                            <Dropdown
                                id="grupo"
                                value={estudiante.CodigoGrupo}
                                options={grupos}
                                optionLabel="Nombre"
                                optionValue="Codigo"
                                placeholder="Seleccione un grupo"
                                onChange={(e) => onGrupoSelect(e)}
                                required
                                autoFocus
                                showClear
                                itemTemplate={(option) => <div>{`${option.Nombre}`}</div>}

                            />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
