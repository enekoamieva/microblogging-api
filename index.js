const express = require('express');
const router = express.Router();
//Conectamos con nuestra BD Mongo externa
require('./mongodb');

//Manejar solicitudes JSON
const bodyParser = require('body-parser');
//Permitr el acceso a los datos de peticiones externas
const cors = require('cors');

//Inicializamos la API
const app = express();

//Cualquier origen va a funcionar en nuestra API
app.use(cors())

app.use(bodyParser.json({ limit: '50Mb' }));
app.use(bodyParser.urlencoded({ limit: '50Mb', extended: true }));


//RUTA USERS
const users = require('./controllers/user');
app.use('/users', users);

//RUTAS POSTS
const posts = require('./controllers/posts');
app.use('/posts', posts);


//Middleware para capturar los errores. All poner como primer parametro ERROR un CATCH con error buscará este middleware
app.use((error, req, res, next) => {
    console.error(error);
    //console.log(error.name);
    if (error.name === 'CastError') {
        return res.status(400).end('Petición incorrecta!! La id usada no está bien');
    } else {
        return res.status(500).end('Error al formular la petición');
    }
});


//Error 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Error 404 ¡No encontrado!'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});