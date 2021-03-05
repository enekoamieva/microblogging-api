const express = require('express');
const router = express.Router();

//User Schema
const User = require('../models/User');

/* router.use((req, res, next) => {
    next();
}); */

//Devolver todos los usuarios
router.get('/', (req, res) => {
    //res.json(listUsers);
    User.find().sort('-dateOfBirth').exec((err, users) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(users);
    })
});

//Obtener un usuario
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            if (user) {
                return res.json(user);
            } else {
                return res.status(404).end('Usuario no encontrado con esa ID');
            }
        })
        .catch(err => next(err));
});

//Añadir usuario
router.post('/', (req, res, next) => {
    let user = req.body;

    if (!user) {
        return res.status(400).json({
            error: 'user is empty'
        });
    }

    const newUser = new User({
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        email: user.email
    });

    //console.log(newUser);

    //console.log(user);
    newUser.save()
        .then(user => res.json(user))
        .catch(error => next(error))

});

//Actualizar usuario
router.put('/:id', (req, res, next) => {
    const updateUser = req.body;
    const id = req.params.id;

    console.log(updateUser);

    User.findByIdAndUpdate(id, { $set: updateUser }, { new: true })
        .then(update => {
            if (update) {
                return res.json(update);
            } else {
                return res.status(404).end('No se ha encontrado un usuario con esa ID');
            }
        })
        .catch(err => next(err));

});

//Eliminar Usuario
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then(user => {
            if (user) {
                return res.json({
                    'Usuario eliminado': user
                });
            } else {
                return res.status(404).end('No se ha encontrado un usuario con esa ID');
            }
        })
        .catch(err => next(err));

});

//Comprobar credenciales usuario
router.post('/acceso', (req, res, next) => {

    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                //comparepassword es un metodo establecido en el modelo de use para comparar las contraseñas
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (err) {

                        return next(err);
                    }
                    if (isMatch) {
                        return res.status(200).send({
                            message: 'ok',
                            role: user.role,
                            id: user.id
                        });
                    } else {
                        res.status(200).end('La contraseña es incorrecta')
                    }
                })
            } else {
                res.status(404).end('El usuario que has introducido no existe!');
            }
        })
        .catch(err => next(err));
});



module.exports = router;