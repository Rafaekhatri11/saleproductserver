const mongoose= require('mongoose');
const Schema = mongoose.Schema;


const Adminuser = new Schema({
   // id : new mongoose.Types.ObjectId,
    Name : String,
    Email: String,
    Pass: String
})


module.exports = mongoose.model('adminuser',Adminuser);