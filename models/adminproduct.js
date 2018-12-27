const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const adminproduct = new Schema({
    Name : String,
    Quantity : String,
    Amount: String
})



module.exports = mongoose.model('adminaddproduct',adminproduct);