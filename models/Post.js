const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('./User');

const PostSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    title: String,
    description: String,
    publicationDate: { type: Date, default: Date.now }
});

//Transformas nuestro Schema para que devuelva el valor del objeto id a parte del valor _id que setea por defecto Mongodb
//Eliminamos de la petición los valores __v y _id
PostSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
            delete returnedObject._id,
            delete returnedObject.__v
    }
});

module.exports = mongoose.model('Post', PostSchema);