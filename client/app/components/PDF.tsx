import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

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
    image: {
        width: 50,
        height: 50,
        alignSelf: 'center', // Centra la imagen horizontalmente
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
        fontWeight: 'bold',
        fontSize: 14,
        textDecoration: 'underline'
    },
    questionSection: {
        marginBottom: 10
    },
    question: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5
    },
    questionImage: {
        marginBottom: 10,
        maxHeight: 200,
        width: 'auto'
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

interface Persona {
    Nombres: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
}

interface Estudiante {
    Codigo: number;
    Persona: Persona;
}

interface Tema {
    Codigo: number;
    Descripcion: string;
}

interface Respuesta {
    Codigo: number;
    Valor: string;
    Tipo: boolean;
}

interface Pregunta {
    Codigo: number;
    Descripcion: string;
    RespuestaSeleccionada: number;
    RutaImagen: string;
    Respuestas: Respuesta[];
}

interface Examen {
    Codigo: number;
    Nota: number;
    Fecha: string;
}

interface PDFProps {
    estudiante: Estudiante;
    examen: Examen;
    tema: Tema;
    preguntas: Pregunta[];
}

const PDF: React.FC<PDFProps> = ({ estudiante, examen, tema, preguntas }) => {
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

    const renderPreguntas = (preguntas: Pregunta[]) => {
        return preguntas.map((pregunta, index) => (
            <View key={pregunta.Codigo} style={styles.questionSection}>
                <Text style={styles.question}>
                    {index + 1}. {pregunta.Descripcion}
                </Text>
                {/* {pregunta.RutaImagen && (
                    <Image style={styles.questionImage} src={pregunta.RutaImagen}/>
                )} */}
                <View style={styles.options}>
                    {pregunta.Respuestas.map((respuesta, idx) => {
                        const isMarked = pregunta.RespuestaSeleccionada === respuesta.Codigo;
                        const optionStyle = isMarked ? (respuesta.Tipo ? styles.markedOptionCorrect : styles.markedOptionIncorrect) : undefined;
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
                <Image src="/layout/images/logo.png" style={styles.image}></Image>

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
