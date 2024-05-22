import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import axios from 'axios';

// Registrar la fuente Oswald
Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 30
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
        fontWeight: 'bold',
        fontFamily: 'Oswald'
    },
    scoreContainer: {
        textAlign: 'right'
    },
    score: {
        fontSize: 40,
        color: 'red',
        fontWeight: 'bold',
        fontFamily: 'Oswald'
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
        fontSize: 13
    },
    markedBien: {
        color: 'green',
        fontWeight: 900
    },
    markedMal: {
        color: 'red',
        fontWeight: 900
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

    const [examen, setExamen] = useState<any>(null);
    const [estudiante, setEstudiante] = useState(estudianteVacio);
    const [tema, setTema] = useState(temaVacio);

    useEffect(() => {
        fetchData();
    }, [CodigoEstudiante, CodigoExamen]);

    const fetchData = async () => {
        await axios
            .get('http://localhost:3001/api/examen/detalleExamen', { params: { CodigoEstudiante, CodigoExamen } })
            .then((response) => {
                console.log(response.data);

                const _estudiante = response.data.estudiante;
                const _tema = response.data.tema;
                const _examen = response.data.examen;
                setExamen(_examen);
                setEstudiante(_estudiante);
                setTema(_tema);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Error al generar el PDF</Text>
                </View>
                {/* <View style={styles.header}>
                    <Text style={styles.title}>Tema: {tema.Descripcion}</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.date}>Nota:</Text>
                        <Text style={styles.score}>20</Text>
                        <Text style={styles.date}>21 de mayo de 2024</Text>
                    </View>
                </View>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{`Estudiante: ${estudiante.Persona.Nombres} ${estudiante.Persona.ApellidoPaterno} ${estudiante.Persona.ApellidoMaterno}`}</Text>
                </View>
                <View style={styles.questionSection}>
                    <Text style={styles.question}>1. ¿De qué color es el cielo?</Text>
                    <View style={styles.options}>
                        <Text>a) azul</Text>
                        <Text style={styles.markedBien}>b) azul</Text>
                        <Text>c) azul</Text>
                        <Text style={styles.markedMal}>d) azul</Text>
                        <Text>e) azul</Text>
                    </View>
                </View> */}
            </Page>
        </Document>
    );
};

export default PDF;
