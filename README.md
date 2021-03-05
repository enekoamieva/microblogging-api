# API REST MICROBLOGGING

Proyecto de API REST para realizar peticiones HTTP a una base de datos MongoDB en la nube. Las peticiones se hacen sobre endpoints que responden a las peticiones HTTP del cliente para realizar las operaciones de CRUD  (Create, Read, Update, Delete).

Estas operaciones se realizan sobre dos colecciones creadas en la base de datos para poder manejar información sobre usuarios y posts.

Los endpoints para los usuarios son:
- `get` /users/
- `get` /users/:id
- `post` /users/
- `put` /users/
- `delete` /users/:id
- `post` /users/acceso

Los endpoints para los posts son:
- `get` /posts/
- `get` /posts/:id
- `get` /posts/user/:id
- `post` /posts/
- `put` /posts/
- `delete` /posts/:id

He creado los esquemas User y Posts en Mongoose para definir los modelos que se asignan a los documentos de las colecciones de la base de datos para disponer de cierto tipado a la hora de trabajar con los datos.

En este proyecto he usado:

- Node.js
- Express
- Mongoose
- MongoDB Atlas