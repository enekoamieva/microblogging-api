const express = require('express');
const router = express.Router();

//User Schema
const User = require('../models/User');
const Post = require('../models/Post');


//Buscar todos los posts
router.get('/', (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => next(err));
});


//Buscar un determinado post
router.get('/:id', (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId)
        .then(post => {
            if (post) {
                return res.status(200).json(post);
            } else {
                return res.status(404).json('El post que buscas no existe');
            }
        })
        .catch(err => next(err));
});

//Buscar todos los posts de un usuario
router.get('/user/:id', (req, res, next) => {
    const userId = req.params.id;
    console.log(userId);

    Post.find({ 'user': userId }).sort('-publicationDate')
        .then(posts => {
            if (posts) {
                return res.status(200).json(posts);
            } else {
                return res.status(404).json('El post que buscas no existe');
            }
        })
        .catch(err => next(err));
});


//Crear un post
router.post('/', (req, res, next) => {
    const userId = req.body.userId;
    const post = req.body;

    if (!post.title || !post.description) {
        return res.status(400).end('El campo title y/o descripción no deben de estar vacíos');
    }

    User.findById(userId)
        .then(userInfo => {

            const newPost = new Post({
                user: userId,
                title: post.title,
                description: post.description
            });

            //Añadir el nuevo Post all array de posts del usuario
            userInfo.posts.push(newPost);

            //Guardar el post en la coleccion de USER y en la de POSTS
            userInfo.save()
                .then(() => {
                    newPost.save()
                        .then(post => {
                            res.status(200).json(post)
                        })
                })

        })
        .catch(err => next(err));
});


//Actualizar un post
router.put('/:id', (req, res, next) => {
    const postId = req.params.id;
    const updatedPost = req.body;

    Post.findByIdAndUpdate(postId, { $set: updatedPost }, { new: true })
        .then(update => {
            if (update) {
                return res.json(update);
            } else {
                return res.status(404).end('No se ha encontrado un post con esa ID');
            }
        })
        .catch(err => next(err));
});


//Eliminar post
router.delete('/:id', (req, res, next) => {
    const postId = req.params.id;

    //Eliminar POST
    Post.findByIdAndRemove(postId)
        .then(post => {
            //Cuando el post es borrado, buscamos al usuario y le actualizamos el array de post que tiene para eliminar la ID del post borrado
            if (post) {
                User.findById(post.user)
                    .then((user) => {
                        //Buscamos en el array de post el ID del post y lo eliminamos
                        const index = user.posts.indexOf(postId);
                        if (index > -1) {
                            user.posts.splice(index, 1);
                            //Guardamos los cambios en BD
                            user.save()
                                .then(() => {
                                    res.status(200).end('Post eliminado')
                                })
                        }
                    })

            } else {
                return res.status(404).end('No se ha encontrado un post con esa ID');
            }
        })
        .catch(err => next(err));
});




module.exports = router;