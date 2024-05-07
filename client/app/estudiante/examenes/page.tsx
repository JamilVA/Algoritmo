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

import { useRouter } from 'next/navigation';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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
        CodigoTema: 0
    };
    const [examenes, setExamenes] = useState<(typeof examenDiarioVacio)[]>([]);

    const [examen, setExamen] = useState(examenDiarioVacio);

    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            cargarExamenes();
        }
    }, [status]);

    const cargarExamenes = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/examen/examenesEstudiante', {
                params: { CodigoEstudiante: session?.user.codigoEstudiante }
            });
            const { examenes } = data;
            console.log('Hola', examenes);
            setExamenes(examenes);
        } catch (error) {
            console.error(error);
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Examenes pendientes</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left"></span>
        </div>
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
        return rowData?.HoraInicio.substring(0, 5) + ' - ' + rowData?.HoraFin.substring(0, 5);
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
        const estadoExamen = rowData?.estudianteExamenDiarios[0]?.Estado ?? false
        return (
            <>
                {estadoExamen && (

                        <Button icon="pi pi-external-link" rounded severity={'secondary'} outlined tooltip="Examen culminado" className="mr-2"/>

                )}
                {!estadoExamen && (
                    <Link
                        href={{
                            pathname: '/estudiante/examenes/examen',
                            query: {
                                Z: rowData.Codigo
                            }
                        }}
                    >
                        <Button icon="pi pi-external-link" rounded severity={'help'} outlined tooltip="Abrir" className="mr-2" />
                    </Link>
                )}
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
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
                        emptyMessage="No hay examenes programados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="Tema.Curso.Nombre" header="Curso" sortable body={cursoBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="Tema.Descripcion" header="Tema" sortable body={temaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Fecha" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column header="Hora" sortable body={horaBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column header="Duracion" sortable body={duracionBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default GestionCursos;
