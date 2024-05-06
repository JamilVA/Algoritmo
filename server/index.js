const express = require('express'); //de esta forma se importa en node

require('dotenv').config();
const { dbConnection } = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Creando el servidor express
const app = express();

//Configuracion de CORS
app.use(cors()); 

//Lectura y parseo del body
app.use(express.json());

//Lectuta de cookies
app.use(cookieParser());

//Conexion a la BD
dbConnection();

app.use('/api/estudiante', require('./routes/estudiante.route'));
app.use('/api/pago', require('./routes/pago.route'));
app.use('/api/apoderado', require('./routes/apoderado.route'));
app.use('/api/docente', require('./routes/docente.route'));
app.use('/api/curso', require('./routes/curso.route'));
app.use('/api/pregunta', require('./routes/pregunta.route'));
app.use('/api/examen', require('./routes/examenDiario.route'));
app.use('/api', require('./routes/auth.route'));


// app.use('/api/docente', require('./routes/docante.route'));

//Para levantar el servidor
app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
})

