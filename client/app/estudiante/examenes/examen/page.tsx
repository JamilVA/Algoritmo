'use client';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from 'primereact/toolbar';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
import { Badge } from 'primereact/badge';
import { StyleClass } from 'primereact/styleclass';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Image } from 'primereact/image';

import { useRouter } from 'next/navigation';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Page = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const CodigoExamen = searchParams.get('Z');

    const { data: session, status } = useSession();

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
        CodigoTema: 0,
        Respuestas: [
            {
                Codigo: 0,
                CodigoPregunta: 0,
                Tipo: false,
                Valor: ''
            }
        ]
    };

    const respuestaVacia = {
        Codigo: 0,
        Tipo: false,
        Valor: '',
        CodigoPregunta: 0
    };

    const examenVacio = {
        Codigo: 0,
        Fecha: new Date(),
        HoraInicio: '08:00',
        HoraFin: '09:00',
        Duracion: 0,
        CodigoTema: 0
    };

    const [examen, setExamen] = useState(examenVacio);
    const [mensaje, setMensaje] = useState('');

    const [temas, setTemas] = useState<(typeof temaVacio)[]>([]);
    const [preguntas, setPreguntas] = useState<any[]>([]);
    const [valorRespuestas, setRespuestasEstudiante] = useState<boolean[]>([]);

    const [curso, setCurso] = useState(cursoVacio);
    const [tema, setTema] = useState(temaVacio);
    const [pregunta, setPregunta] = useState(preguntaVacia);
    const [respuesta, setRespuesta] = useState(respuestaVacia);

    const [tiempoPregunta, setTiempoPregunta] = useState(0);

    const toast = useRef<Toast>(null);
    const [iniciado, setIniciado] = useState(false);
    const [visible, setVisible] = useState(true);
    const toastBC = useRef<Toast>(null);
    const [timeLeft, setTimeLeft] = useState(tiempoPregunta);
    const timerRef = useRef<number | undefined>(undefined);
    const [imagenURL, setImagenURL] = useState<string | null>(null);

    const [selectedRepuesta, setSelectedRepuesta] = useState(-1);
    const [selectedOption, setSelectedOption] = useState(-1);
    const [correcto, setCorrecto] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const [respuestas, setRespuestas] = useState<(number | null)[]>([]);

    const openBtnRef = useRef(null);

    useEffect(() => {
        if (status === 'authenticated') {
            cargarExamen();
        }
    }, [status]);

    useEffect(() => {}, [examen]);

    const cargarExamen = async () => {
        try {
            const { data } = await axios.get('https://api.colegiosalgoritmo.edu.pe/api/examen/datos', {
                params: { CodigoExamen }
            });
            const { examen, preguntas } = data;
            setTiempoPregunta(examen.Duracion * 60);
            setTimeLeft(examen.Duracion * 60);
            setExamen(examen);
            setPreguntas(preguntas);
            console.log('Examen: ', data);
        } catch (error) {
            console.error(error);
        }
    };

    const funcionPrueba = () => {};

    useEffect(() => {
        if (activeIndex < preguntas.length - 1) {
            if (timeLeft === 0) {
                nextQuestion();
            }
        }
    }, [timeLeft]);

    const startTimer = () => {
        setTimeLeft(tiempoPregunta);
        clearInterval(timerRef.current);
        timerRef.current = window.setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerRef.current);
                    return tiempoPregunta;
                }
                return prevTime - 1;
            });
        }, 1000); // Actualizar el tiempo cada segundo
    };

    const nextQuestion = async () => {
        setImagenURL(null)
        setSelectedRepuesta(-1);
        setSelectedOption(-1);
        if (activeIndex < preguntas.length - 1) {
            if (preguntas[activeIndex + 1].RutaImagen) {
                await obtenerArchivo(preguntas[activeIndex + 1].RutaImagen);
            }
            setTimeLeft(tiempoPregunta);
            setActiveIndex(activeIndex + 1);
        } else {
            confirm();
        }
    };

    const siguientePregunta = async () => {
        setImagenURL(null)
        if (selectedRepuesta >= 0) {
            valorRespuestas.push(correcto);
            respuestas.push(selectedRepuesta);
        } else respuestas.push(null);
        setTimeLeft(tiempoPregunta);
        startTimer();
        setSelectedRepuesta(-1);
        setSelectedOption(-1);
        if (activeIndex < preguntas.length - 1) {
            if (preguntas[activeIndex + 1].RutaImagen) {
                await obtenerArchivo(preguntas[activeIndex + 1].RutaImagen);
            }
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleStartClick = () => {
        if (!comprobarAperturaExamen(examen)) {
            setTimeout(() => {
                toast.current?.show({
                    severity: 'warn',
                    summary: '¡Adevertencia!',
                    detail: 'El examen no esta disponible, revisar fecha y hora.',
                    life: 2500
                });
            }, 2500);
            router.push('/estudiante/examenes');
        }
        setIniciado(true);
        startTimer();
        if (preguntas[0]?.RutaImagen) obtenerArchivo(preguntas[0].RutaImagen);
    };

    const clear = () => {
        toastBC.current?.clear();
        router.push('/estudiante/examenes');
    };

    const confirm = () => {
        setVisible(false);
        setTimeout(() => {
            toast.current?.show({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Su examen ha sido enviado correctamente',
                life: 5000
            });
        }, 2500);
        guardarExamen();
    };

    const guardarExamen = async () => {
        const estudianteExamenDiario = {
            CodigoEstudiante: session?.user.codigoEstudiante,
            CodigoExamenDiario: CodigoExamen,
            Nota: valorRespuestas.filter((respuesta: boolean) => respuesta === true).length * 2,
            Correctas: valorRespuestas.filter((respuesta: boolean) => respuesta === true).length,
            Incorrectas: valorRespuestas.length - valorRespuestas.filter((respuesta: boolean) => respuesta === true).length,
            EnBlanco: preguntas.length - valorRespuestas.length,
            Estado: true
        };

        const preguntaEstudianteExamenDiario = preguntas.map((pregunta, index) => ({
            CodigoPregunta: pregunta.Codigo,
            CodigoRespuesta: respuestas[index],
            CodigoEstudiante: session?.user.codigoEstudiante,
            CodigoExamenDiario: CodigoExamen
        }));

        await axios
            .post('https://api.colegiosalgoritmo.edu.pe/api/examen/guardar', {
                estudianteExamenDiario,
                preguntaEstudianteExamenDiario
            })
            .then((response) => {
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
                                Correctas: {valorRespuestas.filter((respuesta: boolean) => respuesta === true).length} <br />
                                Incorrectas: {valorRespuestas.length - valorRespuestas.filter((respuesta: boolean) => respuesta === true).length} <br />
                                En blanco: {preguntas.length - valorRespuestas.length}
                            </div>
                            <Button className="p-button-sm flex" label="OK" severity="info" onClick={clear}></Button>
                        </div>
                    )
                });
            });
    };

    const obtenerArchivo = async (ruta: string) => {
        if (ruta === '') {
            return;
        }
        try {
            const response = await axios.get('https://api.colegiosalgoritmo.edu.pe/api/files/download', {
                params: { fileName: ruta },
                responseType: 'arraybuffer'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);

            setImagenURL(url);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error de carga de imagen',
                life: 3000
            });
        }
    };

    const footer =
        activeIndex === preguntas.length - 1 ? (
            <>
                <Button
                    onClick={() => {
                        if (selectedRepuesta >= 0) {
                            valorRespuestas.push(correcto);
                            respuestas.push(selectedRepuesta);
                        }

                        confirm();
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
                        console.log('Hola');
                        console.log(correcto);
                        // if (correcto) {
                        //     toast.current?.show({
                        //         severity: 'success',
                        //         summary: '¡Correcto!',
                        //         detail: 'Has seleccionado la respuesta correcta.',
                        //         life: 2000
                        //     });
                        // } else {
                        //     toast.current?.show({
                        //         severity: 'error',
                        //         summary: '¡Incorrecto!',
                        //         detail: 'La respuesta que seleccionaste es incorrecta.',
                        //         life: 2000
                        //     });
                        // }
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <StyleClass nodeRef={openBtnRef} selector=".box" enterClassName="hidden" enterActiveClassName="fadein">
                        <Button label="Iniciar" icon="pi pi-play" severity="success" className=" mr-2" ref={openBtnRef} onClick={handleStartClick} disabled={iniciado || !comprobarAperturaExamen(examen)} />
                    </StyleClass>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <p className="m-0 text-900 font-bold text-5xl text-primary">{Math.floor(timeLeft / 60) + 'min ' + (timeLeft % 60) + 's'}</p>
                </div>
            </React.Fragment>
        );
    };

    const comprobarAperturaExamen = (examen: any) => {
        const fechaExamen = new Date(examen.Fecha);
        const hoy = new Date();

        if (fechaExamen.setHours(0, 0, 0, 0) < hoy.setHours(0, 0, 0, 0)) return false;

        const horaActual = new Date();

        // Crear objetos Date para las horas de inicio y fin usando la fecha del examen
        const horaInicio = new Date(`${fechaExamen.toISOString().split('T')[0]}T${examen.HoraInicio}`);
        const horaFin = new Date(`${fechaExamen.toISOString().split('T')[0]}T${examen.HoraFin}`);

        // Comprobar que la hora actual está entre la hora de inicio y la hora de fin
        if (horaActual >= horaInicio && horaActual <= horaFin) {
            return true;
        }

        return false;
    };

    return (
        <div className="col-12">
            <div className="card m-0">
                <Toast ref={toast}></Toast>
                <Toast ref={toastBC} position="center" onRemove={clear} />
                {/* <h1>Tema: Cultura General{curso?.Nombre}</h1> */}
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                {visible && comprobarAperturaExamen(examen) && (
                    <TabView
                        scrollable
                        activeIndex={activeIndex}
                        onTabChange={(e) => {
                            setActiveIndex(e.index);
                        }}
                        className="hidden animation-duration-500 box"
                    >
                        {preguntas.map((pregunta, index) => {
                            return (
                                <TabPanel key={index} header={'Pregunta ' + (index + 1)} disabled={index !== activeIndex}>
                                    <Card title={pregunta1(index + 1, pregunta.Descripcion)} footer={footer}>
                                        <div className="mt-0 m-5">{imagenURL && <Image src={imagenURL} width="150" height="150" zoomSrc={imagenURL} alt="Imagen de apoyo" preview />}</div>

                                        <div className="ml-4 flex">
                                            <div className="flex flex-column gap-3">
                                                {pregunta.Respuesta.map((respuesta: any, index: number) => {
                                                    return (
                                                        <div key={index} className="flex align-items-center ml-5">
                                                            <RadioButton
                                                                name="respuesta"
                                                                value={respuesta.Tipo}
                                                                onChange={(e) => {
                                                                    setSelectedRepuesta(respuesta.Codigo);
                                                                    setSelectedOption(index);
                                                                    setCorrecto(!!e.value);
                                                                    console.log(!!e.value);
                                                                }}
                                                                checked={selectedOption === index}
                                                            />
                                                            <label className="ml-2">{respuesta.Valor}</label>
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
                )}
            </div>
        </div>
    );
};

export default Page;
