'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF from '../../components/PDF';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

interface Examen {
    Codigo: number;
    Curso: string;
    Tema: string;
    Nota: number;
    Correctas: number;
    Incorrectas: number;
    EnBlanco: number;
    Fecha: string;
    HoraFin: string;
}

const Dashboard: React.FC = () => {
    const searchParams = useSearchParams();
    const CodigoEstudiante = searchParams.get('E');

    const [lineOptions, setLineOptions] = useState({});
    const [lineData, setLineData] = useState({ labels: [], datasets: [] });
    const [examenes, setExamenes] = useState<Examen[]>([]);
    const [selectedExamenCodigo, setSelectedExamenCodigo] = useState<number | null>(null);
    const [pdfData, setPdfData] = useState<any>(null);
    const { data: session, status } = useSession();

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
            const { data } = await axios.get('http://localhost:3001/api/examen/reporteExamenesEstudiante', {
                params: { CodigoEstudiante: session?.user.codigoEstudiante }
            });
            setExamenes(data.examenes);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarDataGraficos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/examen/dataChartEstudiante', {
                params: { CodigoEstudiante: session?.user.codigoEstudiante }
            });
            setLineData({ labels: data.labels, datasets: data.datosFinales });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPdfData = async (CodigoEstudiante: number, CodigoExamen: number) => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/examen/detalleExamen', {
                params: { CodigoEstudiante, CodigoExamen }
            });
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const comprobarAperturaExamen = (examen: Examen) => {
        const fechaExamen = new Date(examen.Fecha);
        const hoy = new Date();

        if (fechaExamen.setHours(0, 0, 0, 0) > hoy.setHours(0, 0, 0, 0)) return false;
        const horaActual = new Date();
        const horaFin = new Date(`${fechaExamen.toISOString().split('T')[0]}T${examen.HoraFin}`);
        horaFin.setMinutes(horaFin.getMinutes() + 20);
        return horaActual > horaFin;
    };

    const renderPDFButton = (examen: Examen) => (
        <>
            {(examen.Codigo != selectedExamenCodigo) && (
                <Button
                    icon="pi pi-search"
                    text
                    onClick={async () => {
                        const data = await fetchPdfData(session?.user.codigoEstudiante ?? 0, examen.Codigo);
                        setPdfData({ ...data, CodigoEstudiante: session?.user.codigoEstudiante, CodigoExamen: examen.Codigo });
                        setSelectedExamenCodigo(examen.Codigo);
                    }}
                    tooltip='Descargar PDF'
                ></Button>
            )}
            {(pdfData && examen.Codigo == selectedExamenCodigo) && selectedExamenCodigo !== null && (
                <PDFDownloadLink document={<PDF estudiante={pdfData.estudiante} examen={pdfData.examen} tema={pdfData.tema} preguntas={pdfData.preguntas} />} fileName={`Examen_${selectedExamenCodigo}.pdf`}>
                    {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar ahora')}
                </PDFDownloadLink>
            )}
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ultimos Examenes</h5>
                    <DataTable value={examenes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Curso" header="Curso" sortable headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Tema" header="Tema" headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Nota" header="Nota" sortable headerStyle={{ minWidth: '3rem' }} />
                        <Column field="Correctas" header="Correctas" headerStyle={{ minWidth: '3rem' }} />
                        <Column field="Incorrectas" header="Incorrectas" headerStyle={{ minWidth: '3rem' }} />
                        <Column field="EnBlanco" header="En Blanco" headerStyle={{ minWidth: '3rem' }} />
                        <Column header="Acciones" body={(data) => renderPDFButton(data)} headerStyle={{ minWidth: '8rem' }} />
                    </DataTable>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Tendencia Examenes</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
