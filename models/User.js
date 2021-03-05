const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Post = require('./Post');

//Password encriptacion
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    fullname: String,
    email: { type: String, required: true },
    creationdate: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'subscriber'], default: 'subscriber' },
    posts: [{ type: Schema.ObjectId, ref: 'Post', default: null }]
});

//Hashear el password para cuando se hace un POST
UserSchema.pre('save', function (next) {
    let user = this;

    //Solo aplica el hash al password si ha sido modificado o nuevo
    if (!user.isModified('password')) return next();
    //Genera Salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        //Aplicar hash al password usando nueva salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            //Sobreescribe el password escrito con el hasheado
            user.password = hash;
            next();
        })
    });

});

//Actualizar el password con hash si se realizar un PUT
UserSchema.pre('findOneAndUpdate', function (next) {
    //console.log(this.getUpdate().$set.password);

    if (!this.getUpdate().$set.password) {
        next();
    }

    let password = this.getUpdate().$set.password;

    //Genera Salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        //Aplicar hash al password usando nueva salt
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return next(err);
            //Sobreescribe el password escrito con el hasheado
            password = hash;
            this.getUpdate().$set.password = hash;
            next();
        })
    });

});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch)
    });
};

//Transformas nuestro Schema para que devuelva el valor del objeto id a parte del valor _id que setea por defecto Mongodb
//Eliminamos de la petición los valores __v y _id
UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
            delete returnedObject._id,
            delete returnedObject.__v
    }
});



module.exports = mongoose.model('User', UserSchema);