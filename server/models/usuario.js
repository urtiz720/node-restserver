 const mongoose = require('mongoose');
 const uniqueValidator = require('mongoose-unique-validator');

 let rolesValidos = {
     values: ['ADMIN_ROLE', 'USER_ROLE'],
     message: '{VALUE} no es un rol valido'
 }


 let Schema = mongoose.Schema;

 let usuarioSchema = new Schema({
     nombre: {
         type: String,
         required: [true, 'El nombre es requerido']
     },
     email: {
         type: String,
         unique: true,
         required: [true, 'El email es requerido']
     },
     password: {
         type: String,
         required: [true, 'La contraseña es obligatoria']
     },
     img: {
         type: String
     },
     role: {
         type: String,
         default: 'USER_ROLE',
         enum: rolesValidos
     },
     estado: {
         type: Boolean,
         default: true
     },
     google: {
         type: Boolean,
         default: false
     }
 });

 usuarioSchema.methods.toJSON = function() {
     let user = this;
     let userObject = user.toObject(); //pasamos el objeto
     delete userObject.password; //el objeto sin contraseña

     return userObject;
 }

 usuarioSchema.plugin(uniqueValidator, { //Mensaje de duplicado visto de manera agradable
     message: '{PATH} debe de ser unico'
 })

 module.exports = mongoose.model('usuario', usuarioSchema);