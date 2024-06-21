/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChartData, ChartOptions } from 'chart.js';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import PDF from '../../components/PDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

const estudianteVacio = {
    Codigo: 0,
    Nombres: '',
    Grado: ''
};

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

    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: []
    });

    const [selectedExamenCodigo, setSelectedExamenCodigo] = useState<number | null>(null);
    const [pdfData, setPdfData] = useState<any>(null);

    const toast = useRef<Toast>(null);

    const [promedios, setPromedios] = useState([]);
    const [examenes, setExamenes] = useState([]);

    const [estudiante, setEstudiante] = useState(estudianteVacio);
    const [DNI, setDNI] = useState('');

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
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

    useEffect(() => {
        applyLightTheme();
    }, []);

    const cargarDatos = async () => {
        await axios
            .get('http://localhost:3001/api/examen/reporteExamenesEstudiante', {
                params: { DNI }
            })
            .then((response) => {
                console.log(response.data);

                const _estudiante = response.data.estudiante;
                const _examenes = response.data.examenes;
                setExamenes(_examenes);
                setEstudiante(_estudiante);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: response.data.message,
                    life: 3000
                });
                cargarDataGraficos();
            })
            .catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: !error.response ? error.message : error.response.data.error,
                    life: 3000
                });
            });
    };

    const cargarDataGraficos = async () => {
        try {
            await axios
                .get('http://localhost:3001/api/examen/dataChartEstudiante', {
                    params: { DNI }
                })
                .then((response) => {
                    console.log(response.data);
                    const { data } = response;
                    const { labels, datosFinales } = data;
                    setLineData({ ...lineData, labels: labels, datasets: datosFinales });
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: !error.response ? error.message : error.response.data.error,
                        life: 3000
                    });
                });
        } catch (error) {
            console.error(error);
        }
    };

    const buscarEstudiante = () => {
        if (DNI.length == 8) {
            cargarDatos();
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El DNI debe tener 8 dígitos',
                life: 3000
            });
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

    const renderPDFButton = (examen: Examen) => (
        <>
            {examen.Codigo != selectedExamenCodigo && (
                <Button
                    icon="pi pi-search"
                    text
                    onClick={async () => {
                        const data = await fetchPdfData(estudiante.Codigo ?? 0, examen.Codigo);
                        setPdfData({ ...data, CodigoEstudiante: estudiante.Codigo, CodigoExamen: examen.Codigo });
                        setSelectedExamenCodigo(examen.Codigo);
                    }}
                    tooltip="Descargar PDF"
                ></Button>
            )}
            {pdfData && examen.Codigo == selectedExamenCodigo && selectedExamenCodigo !== null && (
                <PDFDownloadLink document={<PDF estudiante={pdfData.estudiante} examen={pdfData.examen} tema={pdfData.tema} preguntas={pdfData.preguntas} />} fileName={`Examen_${selectedExamenCodigo}.pdf`}>
                    {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar ahora')}
                </PDFDownloadLink>
            )}
        </>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <h6 className="m-0">BUSCAR ESTUDIANTE</h6>
                <InputText
                    className="mt-3 mr-2"
                    value={DNI}
                    autoFocus
                    maxLength={8}
                    type="search"
                    placeholder="Ingrese DNI"
                    onChange={(e) => {
                        setDNI(e.target.value);
                    }}
                />

                <Button
                    icon="pi pi-search"
                    className="p-input-icon-right"
                    // loading={loading}
                    onClick={() => {
                        buscarEstudiante();
                    }}
                    tooltip="Buscar estudiante"
                />
            </div>
            <div className="col-12">
                <div className="card">
                    <h3 className="font-bold">
                        {'Examen x'} <span className="text-primary-500 text-xl">{' ( ' + 'Tema Y' + ' )'}</span>
                    </h3>
                    <h5>Lista de examenes</h5>
                    <DataTable value={examenes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Curso" header="Curso" sortable headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Tema" header="Tema" headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Nota" header="Nota" sortable headerStyle={{ minWidth: '3rem' }} />
                        <Column field="Correctas" header="C" headerStyle={{ minWidth: '2rem' }} />
                        <Column field="Incorrectas" header="I" headerStyle={{ minWidth: '2rem' }} />
                        <Column field="EnBlanco" header="B" headerStyle={{ minWidth: '2rem' }} />
                        <Column body={(data) => renderPDFButton(data)} headerStyle={{ minWidth: '8rem' }} />
                    </DataTable>
                </div>
                {/* <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{
                        borderRadius: '1rem',
                        background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
                    }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">Resumen </div>
                        <div className="text-white font-medium text-5xl">Resultados 2024</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Descargar
                        </Link>
                    </div>
                </div> */}
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Tendencia Examenes</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                {/* <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Promedio de los examenes diarios en el año</h5>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {promedios.map((grado: any, index) => {
                            return (
                                <li key={index} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{grado.grado}</span>
                                        <div className="mt-1 text-600"></div>
                                    </div>
                                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                            <div className={"bg-"+grado.color+"-500 h-full"} style={{ width: (grado.porcentaje+'%') }} />
                                        </div>
                                        <span className={"text-"+grado.color+"-500 ml-3 font-medium"}>{grado.promedio>9 ? grado.promedio : '0'+grado.promedio}/20</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
