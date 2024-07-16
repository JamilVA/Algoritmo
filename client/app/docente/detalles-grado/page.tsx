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
    const [products, setProducts] = useState([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const [niveles, setNiveles] = useState<(typeof nivelVacio)[]>([]);
    const [grados, setGrados] = useState<(typeof gradoVacio)[]>([]);
    const [gradosx, setGradosx] = useState<(typeof gradoVacio)[]>([]);

    const [lineData, setLineData] = useState({
        labels: [],
        datasets: []
    });

    const [promediosGrado, setPromediosGrado] = useState([]);

    const [nivel, setNivel] = useState(nivelVacio);
    const [grado, setGrado] = useState(gradoVacio);

    const [estudiantes, setEstudiantes] = useState(0);
    const [examenes, setExamenes] = useState(0);

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

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const cargarDatos = async () => {
        try {
            const { data } = await axios.get('https://api.colegiosalgoritmo.edu.pe/api/examen/infoReporte');
            const { niveles, grados, examenes, estudiantes } = data;
            console.log('Hola', data);
            setNiveles(niveles);
            setGrados(grados);
            setExamenes(examenes);
            setEstudiantes(estudiantes);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarReporte = async (CodigoGrado: number) => {
        console.log('CodigoRecibido', CodigoGrado);
        try {
            const { data } = await axios.get('https://api.colegiosalgoritmo.edu.pe/api/examen/reporteGrado', {
                params: { CodigoGrado: CodigoGrado }
            });
            const { examenes, datos } = data;
            setProducts(datos);
            console.log('Datos', datos);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarDataGraficos = async (CodigoGrado: number) => {
        try {
            const { data } = await axios.get('https://api.colegiosalgoritmo.edu.pe/api/examen/dataChart', {
                params: { CodigoGrado }
            });
            const { labels, datosFinales, datosPromedios, datosGrado } = data;
            setLineData({ ...lineData, labels: labels, datasets: datosFinales });
            setPromediosGrado(datosPromedios);
            console.log('promediosGrado', datosPromedios);
            console.log('datasets', datosFinales);
        } catch (error) {
            console.error(error);
        }
    };

    const formatCurrency = (value: number) => {
        return value;
    };

    const onNivelSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';
        setGradosx(grados.filter((g) => g.CodigoNivel == val));
        let nivelx = niveles.find((nivel) => nivel.Codigo === val);

        let _nivel = { ...nivel, Nombre: nivelx?.Nombre ?? '', Codigo: nivelx?.Codigo ?? 0 };

        setNivel(_nivel);
        setGrado(gradoVacio);
    };

    const onGradoxSelect = (e: any) => {
        const val = (e.target && e.target.value) || '';

        let gradox = grados.find((grado) => grado.Codigo === val);

        let _grado = { ...grado, Nombre: gradox?.Nombre ?? '', Codigo: gradox?.Codigo ?? 0, CodigoNivel: gradox?.CodigoNivel ?? 0 };

        cargarDataGraficos(val);

        setGrado(_grado);
        cargarReporte(val);
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Estudiantes</span>
                            <div className="text-900 font-medium text-xl">{estudiantes}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{estudiantes} nuevos </span>
                    <span className="text-500">el ultimo año</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Examenes</span>
                            <div className="text-900 font-medium text-xl">{examenes}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-excel text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{examenes} </span>
                    <span className="text-500">registrados el ultimo mes</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Pagos Mensuales</span>
                            <div className="text-900 font-medium text-xl">$0.0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">%0+ </span>
                    <span className="text-500">since last month</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Inasistencias</span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-exclamation-circle text-red-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">last month</span>
                </div>
            </div>

            <div className="grid col-12">
                <div className="col-12 lg:col-3 xl:col-3">
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
                </div>
                <div className="col-12 lg:col-3 xl:col-3">
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
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ultimos Examenes</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Curso" header="Curso" headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Tema" header="Tema" sortable headerStyle={{ minWidth: '6rem' }} />
                        <Column field="Resueltos" header="Resueltos" sortable headerStyle={{ minWidth: '3rem' }} />
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

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Tendencia Examenes</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                {/* <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)} />
                            <Menu
                                ref={menu2}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">TODAY</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Richard Jones
                                <span className="text-700">
                                    {' '}
                                    has purchased a blue t-shirt for <span className="text-blue-500">79$</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-download text-xl text-orange-500" />
                            </div>
                            <span className="text-700 line-height-3">
                                Your request for withdrawal of <span className="text-blue-500 font-medium">2500$</span> has been initiated.
                            </span>
                        </li>
                    </ul>

                    <span className="block text-600 font-medium mb-3">YESTERDAY</span>
                    <ul className="p-0 m-0 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Keyser Wick
                                <span className="text-700">
                                    {' '}
                                    has purchased a black jacket for <span className="text-blue-500">59$</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-question text-xl text-pink-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Jane Davis
                                <span className="text-700"> has posted a new questions about your product.</span>
                            </span>
                        </li>
                    </ul>
                </div> */}
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Promedio de los examenes diarios en el año</h5>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {promediosGrado.map((curso: any, index) => {
                            return (
                                <li key={index} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{curso.curso}</span>
                                        <div className="mt-1 text-600"></div>
                                    </div>
                                    <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                        <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                            <div className={"bg-"+curso.color+"-500 h-full"} style={{ width: (curso.porcentaje+'%') }} />
                                        </div>
                                        <span className={"text-"+curso.color+"-500 ml-3 font-medium"}>{curso.promedio>9 ? curso.promedio : '0'+curso.promedio}/20</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
