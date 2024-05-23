import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import axios from 'axios';

// Registrar la fuente Roboto
Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: '/fonts/Roboto-Regular.ttf',
            fontWeight: 400
        },
        {
            src: '/fonts/Roboto-Bold.ttf',
            fontWeight: 700
        }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Roboto'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    scoreContainer: {
        textAlign: 'right'
    },
    score: {
        fontSize: 40,
        color: 'red',
        fontWeight: 'bold'
    },
    date: {
        fontSize: 9,
        color: 'grey'
    },
    studentInfo: {
        marginBottom: 20
    },
    studentName: {
        fontSize: 14
    },
    questionSection: {
        marginBottom: 10
    },
    question: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5
    },
    options: {
        marginLeft: 20,
        fontSize: 14
    },
    markedOptionCorrect: {
        color: 'green',
        fontWeight: 'bold'
    },
    markedOptionIncorrect: {
        color: 'red',
        fontWeight: 'bold'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

interface PDFProps {
    CodigoEstudiante: number;
    CodigoExamen: number;
}

const PDF: React.FC<PDFProps> = ({ CodigoEstudiante, CodigoExamen }) => {
    const estudianteVacio = {
        Codigo: 0,
        Persona: {
            Nombres: '',
            ApellidoPaterno: '',
            ApellidoMaterno: ''
        }
    };

    const temaVacio = {
        Codigo: 0,
        Descripcion: ''
    };

    const [estudiante, setEstudiante] = useState(estudianteVacio);
    const [examen, setExamen] = useState<any>(null);
    const [tema, setTema] = useState(temaVacio);
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        fetchData();
    }, [CodigoEstudiante, CodigoExamen]);

    const fetchData = async () => {
        await axios
            .get('http://localhost:3001/api/examen/detalleExamen', { params: { CodigoEstudiante, CodigoExamen } })
            .then((response) => {
                console.log(response.data);

                const { estudiante, tema, preguntas, examen } = response.data;
                setExamen(examen);
                setPreguntas(preguntas);
                setEstudiante(estudiante);
                setTema(tema);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'America/Lima'
        };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', options).format(date);
    };

    const renderPreguntas = (preguntas: any[]) => {
        return preguntas.map((pregunta, index) => (
            <View key={pregunta.Codigo} style={styles.questionSection}>
                <Text style={styles.question}>
                    {index + 1}. {pregunta.Descripcion}
                </Text>
                <View style={styles.options}>
                    {pregunta.Respuestas.map((respuesta: any, idx: number) => {
                        const isMarked = pregunta.RespuestaSeleccionada === idx + 1;
                        const optionStyle = isMarked
                            ? respuesta.Tipo
                                ? styles.markedOptionCorrect
                                : styles.markedOptionIncorrect
                            : undefined;
                        return (
                            <Text key={idx} style={optionStyle}>
                                {String.fromCharCode(97 + idx)}) {respuesta.Valor} {respuesta.Tipo ? '(Correcta)' : ''}
                            </Text>
                        );
                    })}
                </View>
            </View>
        ));
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tema: {tema.Descripcion}</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.date}>Nota:</Text>
                        <Text style={styles.score}>{examen?.Nota}</Text>
                        <Text style={styles.date}>{examen ? formatDate(examen.Fecha) : ''}</Text>
                    </View>
                </View>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{`Estudiante: ${estudiante.Persona.Nombres} ${estudiante.Persona.ApellidoPaterno} ${estudiante.Persona.ApellidoMaterno}`}</Text>
                </View>
                {preguntas && renderPreguntas(preguntas)}
            </Page>
        </Document>
    );
};

export default PDF;
