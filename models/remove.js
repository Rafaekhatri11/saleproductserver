const mongoose = require('mongoose');
const Schema = mongoose.Schema


const Remove =  new Schema({
  Name: String,
})


module.exports = mongoose.model('Deletedata',Remove);