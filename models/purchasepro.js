const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const purchasepro = new Schema({
    userid: String,
    Email : String,
    Productid: String,
    Productname: String,
    quantity : String,
    Amount: String
})


module.exports = mongoose.model('Purchaseproduct',purchasepro);