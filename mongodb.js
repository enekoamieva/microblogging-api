const mongoose = require('mongoose');
//Para tomar  las variables de entorno creadas en el fichero .env
require('dotenv').config();

//Establecemos configuraciones para evitar avisos del servidor
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Conectamos con nuestra BD Mongo externa
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('Conexión establecida a MONGODB'))
    .catch((err) => console.log(err));
