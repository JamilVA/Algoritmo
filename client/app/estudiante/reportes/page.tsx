/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const nivelVacio = {
    Codigo: 0,
    Nombre: ''
};

const gradoVacio = {
    Codigo: 0,
    Nombre: '',
    CodigoNivel: 0
};

const Dashboard = () => {

    const searchParams = useSearchParams();
    const CodigoEstudiante = searchParams.get('E');
    
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});

    const [lineData, setLineData] = useState({
        labels: [],
        datasets: []
    });

    const [promedios, setPromedios] = useState([]);

    const [examenes, setExamenes] = useState([]);

    const { data: session, status } = useSession();


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
        if (status === 'authenticated') {
            applyLightTheme();
            cargarDatos();
            cargarDataGraficos()
        }
    }, [status]);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/examen/reporteExamenesEstudiante', {
                params: { CodigoEstudiante: session?.user.codigoEstudiante }
            });
            const { examenes } = data;
            console.log('Datos', examenes);
            setExamenes(examenes)
        } catch (error) {
            console.error(error);
        }
    };

    const cargarDataGraficos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/examen/dataChartEstudiante', {
                params: { CodigoEstudiante: session?.user.codigoEstudiante }
            });
            const { labels, datosFinales } = data;
            setLineData({ ...lineData, labels: labels, datasets: datosFinales });
            console.log('datasets', datosFinales);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Ultimos Examenes</h5>
                    <DataTable value={examenes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Curso" header="Curso" sortable headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Tema" header="Tema"  headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Nota" header="Nota" sortable headerStyle={{ minWidth: '3rem' }} />
                        <Column field="Correctas" header="C" headerStyle={{ minWidth: '2rem' }} />
                        <Column field="Incorrectas" header="I" headerStyle={{ minWidth: '2rem' }} />
                        <Column field="EnBlanco" header="B" headerStyle={{ minWidth: '2rem' }} />
                        <Column
                            header="Ver"
                            headerStyle={{ minWidth: '1rem' }}
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" text />
                                </>
                            )}
                        />
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
