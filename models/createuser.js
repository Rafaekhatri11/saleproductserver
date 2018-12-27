const mongoose= require('mongoose');
const Schema = mongoose.Schema;


const Createmlabuser = new Schema({
   // id : new mongoose.Types.ObjectId,
    Name : String,
    Email: String,
    Pass: String
})


module.exports = mongoose.model('mlabsignup',Createmlabuser);