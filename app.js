const express = require('express');
const graphqlHTTP= require('express-graphql');
const schema = require('./schema/schema');
const mongoose= require('mongoose');
const cors = require('cors');
const app = express();
const userRoute= require('./models/signuproutes');
const bodyParser = require("body-parser");
//allow cross-origin  requests
app.use(cors());

//body parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}))
app.use("/user",userRoute);


mongoose.connect('mongodb://rafae:meh169222@ds135952.mlab.com:35952/graphql');
mongoose.connection.once('open' , () => {
    console.log('connected to database');
})
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))

app.listen(4000,() => {
    console.log('listening for request on port 4000')
})