'use client';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from 'primereact/toolbar';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
import { Badge } from 'primereact/badge';
import { StyleClass } from 'primereact/styleclass';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { renderToString } from 'react-dom/server';

import { useRouter } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const codigoCurso = searchParams.get('codigoCurso');

    const cursoVacio = {
        Codigo: 0,
        CodigoGrado: 0,
        CodigoDocente: 0,
        Nombre: ''
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
        CodigoTema: 0
    };

    const respuestaVacia = {
        Codigo: 0,
        Tipo: false,
        Valor: '',
        CodigoPregunta: 0
    };

    const [temas, setTemas] = useState<(typeof temaVacio)[]>([]);
    const [preguntas, setPreguntas] = useState<(typeof preguntaVacia)[]>([]);
    const [respuestasEstudiante, setRespuestasEstudiante] = useState<boolean[]>([]);

    const [curso, setCurso] = useState(cursoVacio);
    const [tema, setTema] = useState(temaVacio);
    const [pregunta, setPregunta] = useState(preguntaVacia);
    const [respuesta, setRespuesta] = useState(respuestaVacia);

    const toast = useRef<Toast>(null);
    const [visible, setVisible] = useState(false);
    const toastBC = useRef<Toast>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerRef = useRef<number | undefined>(undefined);
    const [selectedRepuesta, setSelectedRepuesta] = useState(-1);
    const [correcto, setCorrecto] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        // Limpiar el temporizador cuando el componente se desmonte o cambie de pregunta
        return () => {
            clearInterval(timerRef.current);
        };
    }, [activeIndex]);


    const cargarPreguntas = async (CodigoCurso: any) => {
        console.log('Hola');
        try {
            const { data } = await axios.get('http://localhost:3001/api/pregunta', {
                params: { CodigoCurso }
            });
            const { curso, temas } = data;
            console.log('Hola', data);
            setCurso(curso);
            setTemas(temas);
        } catch (error) {
            console.error(error);
        }
    };

    const funcionPrueba = () => {};

    const startTimer = () => {
        setTimerRunning(true);
        timerRef.current = window.setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerRef.current);
                    setTimerRunning(false);
                    nextQuestion()
                    return 60;
                }
                return prevTime - 1;
            });
        }, 1000); // Actualizar el tiempo cada segundo
    };

    // Función para detener el temporizador
    const stopTimer = () => {
        clearInterval(timerRef.current);
        setTimerRunning(false);
    };

    // Función para pasar a la siguiente pregunta
    const nextQuestion = () => {
        if (activeIndex < tabs.length - 3) {
            setActiveIndex((prevIndex) => prevIndex + 1);
            setTimeLeft(60);
            startTimer();
        }
    };

    // Función para manejar el clic en el botón "Iniciar"
    const handleStartClick = () => {
        startTimer();
    };



    const [tabs, setTabs] = useState([
        {
            index: 1,
            pregunta: '¿Cuál es el océano más grande del mundo?',
            respuestas: [
                { texto: 'Océano Atlántico', correcta: false },
                { texto: 'Océano Pacífico', correcta: true },
                { texto: 'Océano Índico', correcta: false },
                { texto: 'Océano Ártico', correcta: false }
            ],
            title: 'Pregunta 1',
            content: 'Pregunta 1 Content...',
            disabled: false
        },
        {
            index: 2,
            pregunta: '¿Quién escribió "Don Quijote de la Mancha"?',
            respuestas: [
                { texto: 'Miguel de Cervantes', correcta: true },
                { texto: 'Gabriel García Márquez', correcta: false },
                { texto: 'William Shakespeare', correcta: false },
                { texto: 'Jorge Luis Borges', correcta: false }
            ],
            title: 'Pregunta 2',
            content: 'Pregunta 2 Content...',
            disabled: false
        },
        {
            index: 3,
            pregunta: '¿Cuál es el río más largo del mundo?',
            respuestas: [
                { texto: 'Río Amazonas', correcta: true },
                { texto: 'Río Nilo', correcta: false },
                { texto: 'Río Yangtsé', correcta: false },
                { texto: 'Río Misisipi', correcta: false }
            ],
            title: 'Pregunta 3',
            content: 'Pregunta 3 Content...',
            disabled: false
        },
        {
            index: 4,
            pregunta: '¿Cuál es el elemento más abundante en la corteza terrestre?',
            respuestas: [
                { texto: 'Oxígeno', correcta: false },
                { texto: 'Hierro', correcta: false },
                { texto: 'Silicio', correcta: true },
                { texto: 'Calcio', correcta: false }
            ],
            title: 'Pregunta 4',
            content: 'Pregunta 4 Content...',
            disabled: false
        },
        {
            index: 5,
            pregunta: '¿En qué año llegó el hombre a la Luna por primera vez?',
            respuestas: [
                { texto: '1969', correcta: true },
                { texto: '1971', correcta: false },
                { texto: '1965', correcta: false },
                { texto: '1975', correcta: false }
            ],
            title: 'Pregunta 5',
            content: 'Pregunta 5 Content...',
            disabled: false
        },
        {
            index: 6,
            pregunta: '¿Cuál es el país más grande del mundo?',
            respuestas: [
                { texto: 'Estados Unidos', correcta: false },
                { texto: 'Rusia', correcta: true },
                { texto: 'China', correcta: false },
                { texto: 'Canadá', correcta: false }
            ],
            title: 'Pregunta 6',
            content: 'Pregunta 6 Content...',
            disabled: false
        },
        {
            index: 7,
            pregunta: '¿Quién pintó la Mona Lisa?',
            respuestas: [
                { texto: 'Leonardo da Vinci', correcta: true },
                { texto: 'Pablo Picasso', correcta: false },
                { texto: 'Vincent van Gogh', correcta: false },
                { texto: 'Claude Monet', correcta: false }
            ],
            title: 'Pregunta 7',
            content: 'Pregunta 7 Content...',
            disabled: false
        },
        {
            index: 8,
            pregunta: '¿Cuál es el metal más caro del mundo?',
            respuestas: [
                { texto: 'Oro', correcta: false },
                { texto: 'Platino', correcta: false },
                { texto: 'Rodio', correcta: true },
                { texto: 'Paladio', correcta: false }
            ],
            title: 'Pregunta 8',
            content: 'Pregunta 8 Content...',
            disabled: false
        },
        {
            index: 9,
            pregunta: '¿Cuál es el animal más grande del mundo?',
            respuestas: [
                { texto: 'Elefante africano', correcta: false },
                { texto: 'Ballena azul', correcta: true },
                { texto: 'Tiburón ballena', correcta: false },
                { texto: 'Jirafa', correcta: false }
            ],
            title: 'Pregunta 9',
            content: 'Pregunta 9 Content...',
            disabled: false
        },
        {
            index: 10,
            pregunta: '¿Cuál es el desierto más grande del mundo?',
            respuestas: [
                { texto: 'Desierto del Sahara', correcta: true },
                { texto: 'Desierto de Atacama', correcta: false },
                { texto: 'Desierto de Kalahari', correcta: false },
                { texto: 'Desierto de Gobi', correcta: false }
            ],
            title: 'Pregunta 10',
            content: 'Pregunta 10 Content...',
            disabled: false
        }
    ]);

    const clear = () => {
        toastBC.current?.clear();
        setVisible(false);
        router.push('/estudiante/examenes');
    };

    const confirm = () => {
        setTimeout(() => {
            toast.current?.show({
                severity: 'success',
                summary: 'Examen enviado',
                detail: 'Felicitaciones, su examen ha sido enviado',
                life: 5000
            });
        }, 2500);

        if (!visible) {
            setVisible(true);
            toastBC.current?.clear();
            toastBC.current?.show({
                severity: 'info',
                summary: 'Can you send me the report?',
                sticky: true,
                content: (
                    <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                        <div className="flex align-items-center gap-2">
                            <span className="font-bold text-900">Resultado del examen</span>
                        </div>
                        <div className="font-medium text-lg my-3 text-900">
                            Correctas: {respuestasEstudiante.filter((respuesta: boolean) => respuesta === true).length} / {respuestasEstudiante.length}
                        </div>
                        <Button className="p-button-sm flex" label="OK" severity="info" onClick={clear}></Button>
                    </div>
                )
            });
        }
    };

    const footer =
        activeIndex === tabs.length - 1 ? (
            <>
                <Button
                    onClick={() => {
                        confirm();
                        if (correcto) {
                            toast.current?.show({
                                severity: 'success',
                                summary: '¡Correcto!',
                                detail: 'Has seleccionado la respuesta correcta.',
                                life: 2000
                            });
                        } else {
                            toast.current?.show({
                                severity: 'error',
                                summary: '¡Incorrecto!',
                                detail: 'La respuesta que seleccionaste es incorrecta.',
                                life: 2000
                            });
                        }
                    }}
                    label="Enviar Examen"
                    icon="pi pi-check"
                    severity="success"
                />
            </>
        ) : (
            <>
                <Button
                    onClick={() => {
                        siguientePregunta();
                    }}
                    label="Siguiente Pregunta"
                    icon="pi pi-forward"
                />
            </>
        );

    const pregunta1 = (index: number, texto: string) => {
        return (
            <>
                <div className="grid col-12">
                    <div className="col-auto">
                        <Badge value={index} size="xlarge" className="mt-2"></Badge>
                    </div>
                    <div className="col-10">
                        <p className="m-0">{texto}</p>
                    </div>
                </div>
            </>
        );
    };

    const siguientePregunta = () => {
        setTimeLeft(60);
        startTimer();
        if (correcto) {
            toast.current?.show({
                severity: 'success',
                summary: '¡Correcto!',
                detail: 'Has seleccionado la respuesta correcta.',
                life: 2000
            });
        } else {
            toast.current?.show({
                severity: 'error',
                summary: '¡Incorrecto!',
                detail: 'La respuesta que seleccionaste es incorrecta.',
                life: 2000
            });
        }
        setSelectedRepuesta(-1);
        respuestasEstudiante.push(correcto);
        console.log(respuestasEstudiante);
        if (activeIndex < tabs.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <StyleClass nodeRef={openBtnRef} selector=".box" enterClassName="hidden" enterActiveClassName="fadein">
                        <Button label="Iniciar" icon="pi pi-play" severity="success" className=" mr-2" ref={openBtnRef} onClick={handleStartClick}/>
                    </StyleClass>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <p className="m-0 text-900 font-bold text-5xl text-primary">{timeLeft}</p>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="col-12">
            <div className="card m-0">
                <Toast ref={toast}></Toast>
                <Toast ref={toastBC} position="center" onRemove={clear} />
                <h1>Tema: Cultura General{curso?.Nombre}</h1>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <TabView
                    scrollable
                    activeIndex={activeIndex}
                    onTabChange={(e) => {
                        setActiveIndex(e.index);
                    }}
                    className="hidden animation-duration-500 box"
                >
                    {tabs.map((tab, index) => {
                        return (
                            <TabPanel key={tab.title} header={tab.title} disabled={index !== activeIndex}>
                                <Card title={pregunta1(index + 1, tab.pregunta)} footer={footer}>
                                    <div className="ml-4 flex">
                                        <div className="flex flex-column gap-3">
                                            {tab.respuestas.map((respuesta, index: number) => {
                                                return (
                                                    <div key={index} className="flex align-items-center ml-5">
                                                        <RadioButton
                                                            name="respuesta"
                                                            value={respuesta.correcta}
                                                            onChange={(e) => {
                                                                setSelectedRepuesta(index);
                                                                setCorrecto(e.value);
                                                            }}
                                                            checked={selectedRepuesta === index}
                                                        />
                                                        <label className="ml-2">{respuesta.texto}</label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Card>
                                <img src="" alt="" />
                            </TabPanel>
                        );
                    })}
                    <TabPanel disabled></TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default Page;
