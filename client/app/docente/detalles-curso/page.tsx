'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF from '../../components/PDF';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

interface Examen {
    CodigoExamen: number;
    CodigoEstudiante: number;
    Curso: string;
    Tema: string;
    Nota: number;
    Correctas: number;
    Incorrectas: number;
    EnBlanco: number;
    Fecha: string;
    HoraFin: string;
}

const estudianteVacio = {
    Codigo: 0,
    Nombres: '',
    Grado: ''
};

const cursoVacio = {
    Codigo: 0,
    Nombre: '',
    Grado: ''
};

const Dashboard: React.FC = () => {

    const examenVacio = {
        CodigoExamen: 0,
        CodigoEstudiante: 0,
        Curso: '',
        Tema: '',
        Nota: 0,
        Correctas: 0,
        Incorrectas: 0,
        EnBlanco: 0,
        Fecha: '',
        HoraFin: '',
    }

    const searchParams = useSearchParams();
    const CodigoCurso = searchParams.get('E');

    const [lineOptions, setLineOptions] = useState({});
    const [lineData, setLineData] = useState({ labels: [], datasets: [] });
    const [examenes, setExamenes] = useState<Examen[]>([]);
    const [selectedExamenCodigo, setSelectedExamenCodigo] = useState<number | null>(null);
    const [pdfData, setPdfData] = useState<any>(null);
    const { data: session, status } = useSession();

    const [estudiante, setEstudiante] = useState(estudianteVacio);
    const [curso, setCurso] = useState(cursoVacio);

    const [examen, setExamen] = useState<Examen>();
    const [examenesDialog, setExamenesDialog] = useState(false);
    const [examenesTema, setExamenesTema] = useState<Examen[]>([]);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            applyLightTheme();
            cargarDatos();
            cargarDataGraficos();
        }
    }, [status]);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/reporteCurso', {
                params: { CodigoCurso: CodigoCurso }
            });
            setExamenes(data.datos);
            setCurso(data.curso);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarDataGraficos = async () => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/dataChartCurso', {
                params: { CodigoCurso: CodigoCurso }
            });
            setLineData({ labels: data.labels, datasets: data.datosFinales });
        } catch (error) {
            console.error(error);
        }
    };

    const cargarListaExamenes = async (CodigoExamen: number) => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/reporteExamenes', {
                params: { CodigoExamen }
            });
            setExamenesTema(data.examenes);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPdfData = async (CodigoEstudiante: number, CodigoExamen: number) => {
        try {
            const { data } = await axios.get('https://back.colegiosalgoritmo.edu.pe/api/examen/detalleExamen', {
                params: { CodigoEstudiante, CodigoExamen }
            });
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const renderPDFButton = (examen: Examen) => (
        <>
            {examen.CodigoEstudiante != selectedExamenCodigo && (
                <Button
                    icon="pi pi-search"
                    text
                    onClick={async () => {
                        const data = await fetchPdfData(Number(examen.CodigoEstudiante) ?? 0, examen.CodigoExamen);
                        setPdfData({ ...data, CodigoEstudiante: Number(examen.CodigoExamen), CodigoExamen: examen.CodigoExamen });
                        setSelectedExamenCodigo(examen.CodigoEstudiante);
                    }}
                    tooltip="Descargar PDF"
                ></Button>
            )}
            {pdfData && examen.CodigoEstudiante == selectedExamenCodigo && selectedExamenCodigo !== null && (
                <PDFDownloadLink document={<PDF estudiante={pdfData.estudiante} examen={pdfData.examen} tema={pdfData.tema} preguntas={pdfData.preguntas} />} fileName={`Examen_${selectedExamenCodigo}.pdf`}>
                    {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar ahora')}
                </PDFDownloadLink>
            )}
        </>
    );

    const hideExamenesDialog = () => {
        setPdfData(null);
        setSelectedExamenCodigo(null);
        setExamen(examenVacio)
        setExamenesDialog(false);
        // setEstudiante(estudianteVacio);
    };

    const examenesDialofgFooter = (
        <>
            <Button label="Salir" icon="pi pi-times" text onClick={hideExamenesDialog} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h3 className="font-bold">
                        {curso.Nombre} <span className="text-primary-500 text-xl">{' ( ' + curso.Grado + ' )'}</span>
                    </h3>
                    <h5>Ultimos Examenes</h5>
                    <DataTable value={examenes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Curso" header="Curso" headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Tema" header="Tema" sortable headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Resueltos" header="Resueltos" sortable headerStyle={{ minWidth: '3rem' }} />
                        <Column
                            header="Ver"
                            headerStyle={{ minWidth: '1rem' }}
                            body={(data) => (
                                <>
                                    <Button
                                        icon="pi pi-search"
                                        text
                                        onClick={() => {
                                            cargarListaExamenes(data.Codigo);
                                            setExamen(data);
                                            setExamenesDialog(true);
                                        }}
                                    />
                                </>
                            )}
                        />
                    </DataTable>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Tendencia Examenes</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
            <Dialog visible={examenesDialog} style={{ width: '750px' }} header={'Lista de examenes: ' + examen?.Tema} modal className="p-fluid" footer={examenesDialofgFooter} onHide={hideExamenesDialog}>
                <DataTable value={examenesTema} rows={5} paginator responsiveLayout="scroll">
                    <Column field="Estudiante" header="Estudiante" sortable headerStyle={{ minWidth: '6rem' }} />
                    <Column field="Nota" header="Nota" sortable headerStyle={{ minWidth: '3rem' }} />
                    <Column field="Fecha" header="Fecha" sortable headerStyle={{ minWidth: '3rem' }} />
                    <Column field="Correctas" header="C" headerStyle={{ minWidth: '2rem' }} />
                    <Column field="Incorrectas" header="I" headerStyle={{ minWidth: '2rem' }} />
                    <Column field="EnBlanco" header="B" headerStyle={{ minWidth: '2rem' }} />
                    <Column body={(data) => renderPDFButton(data)} headerStyle={{ minWidth: '8rem' }} />
                </DataTable>
            </Dialog>
        </div>
    );
};

export default Dashboard;
