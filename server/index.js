const express = require('express');

require('dotenv').config();
const { dbConnection } = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

dbConnection();

app.get("/api", (req, res) => {
  res.send("Hola Mundo! AEAS");
});

app.use('/api/estudiante', require('./routes/estudiante.route'));
app.use('/api/pago', require('./routes/pago.route'));
app.use('/api/apoderado', require('./routes/apoderado.route'));
app.use('/api/docente', require('./routes/docente.route'));
app.use('/api/curso', require('./routes/curso.route'));
app.use('/api/pregunta', require('./routes/pregunta.route'));
app.use('/api/examen', require('./routes/examenDiario.route'));
app.use('/api', require('./routes/auth.route'));
app.use('/api/files', require('./routes/files.route'));

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT);
});
