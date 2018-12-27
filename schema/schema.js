const graphql = require('graphql');
const mlabsignup = require('../models/createuser');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull,
    GraphQLID, GraphQLList } = graphql;
const adminaddproduct = require('../models/adminproduct');
const Purchaseproduct = require('../models/purchasepro');


const createUser = new GraphQLObjectType({
    name: 'userformlab',
    fields: () => ({
        id: { type: GraphQLID },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Pass: { type: new GraphQLNonNull(GraphQLID) }

    })
})

const addproduct = new GraphQLObjectType({
    name: 'adminaddproduct',
    fields: () => ({
        id: { type: GraphQLID },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Quantity: { type: new GraphQLNonNull(GraphQLID) },
        Amount: { type: new GraphQLNonNull(GraphQLID) }
    })
})

const purchasepro = new GraphQLObjectType({
    name: "purchasepro",
    fields: () => ({
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Productid: { type: new GraphQLNonNull(GraphQLID) },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Quantity: { type: new GraphQLNonNull(GraphQLID) },
        Amount: { type: new GraphQLNonNull(GraphQLID) },
        userid: { type: new GraphQLNonNull(GraphQLID) }
    })
})


const allusers = new GraphQLObjectType({
    name: 'alluser',
    fields: () => ({
        id: { type: GraphQLID },
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Pass: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const listofproducts = new GraphQLObjectType({
    name: 'listproduct',
    fields: () => ({
        id: { type: GraphQLID },
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Quantity: { type: new GraphQLNonNull(GraphQLID) },
        Amount: { type: new GraphQLNonNull(GraphQLID) }
    })
})

const Userpurchaeproduct = new GraphQLObjectType({
    name: 'userlist',
    fields: () => ({

        userid: { type: GraphQLID },
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Productid: { type: GraphQLID },
        Productname: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: GraphQLID },
        Amount: { type: GraphQLID }
    })
})

const deletetheuser = new GraphQLObjectType({
    name: 'deleteuser',
    fields: () => ({
        id: { type: GraphQLID },
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Pass: { type: new GraphQLNonNull(GraphQLString) },
        Name: { type: new GraphQLNonNull(GraphQLString) }
    })
})
const Rootquery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        signin: {
            type: createUser,
            args: {
                Email: { type: GraphQLString },
                Pass: { type: GraphQLID }
            },
            resolve(parent, args) {
                return mlabsignup.findOne({ "Email": args.Email, "Pass": args.Pass });

            }
        },

        productlist: {

            type: new GraphQLList(listofproducts),
            args: {},
            resolve(parent, args) {
                return adminaddproduct.find({})
            }
        },

        listofalluser: {
            type: new GraphQLList(allusers),
            resolve(parent, args) {
                return mlabsignup.find({})
            }
        }
        ,
        userproducts: {
            type: new GraphQLList(Userpurchaeproduct),
            args: {},
            resolve(parent, args) {
                return Purchaseproduct.find({})
            }
        }
    }
});

//Mutation means edit ,delete or add the data
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {


        editproduct: {
            type: addproduct,
            args: {
                id: { type: GraphQLID },
                Quantity: { type: GraphQLID }
            },
            resolve(parent, args) {
                return adminaddproduct.findByIdAndUpdate(args.id, { "Quantity": args.Quantity });
            }
        },
        addproduct: {
            type: addproduct,
            args: {
                Name: { type: new GraphQLNonNull(GraphQLString) },
                Quantity: { type: new GraphQLNonNull(GraphQLID) },
                Amount: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {

                return adminaddproduct.findOne({ "Name": args.Name }).then((pro) => {
                    if (pro) {
                        console.log('Product already exist');
                    }
                    else {
                        let data = new adminaddproduct({
                            Name: args.Name,
                            Quantity: args.Quantity,
                            Amount: args.Amount
                        })
                        return data.save();
                    }

                })

            }
        },

        purchaseproduct: {
            type: purchasepro,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                Email: { type: new GraphQLNonNull(GraphQLString) },
                productid: { type: new GraphQLNonNull(GraphQLID) },
                productname: { type: new GraphQLNonNull(GraphQLString) },
                quantity: { type: new GraphQLNonNull(GraphQLID) },
                // amount: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return adminaddproduct.findById(args.productid).then(data => {

                    if (Number(args.quantity) > Number(data.Quantity)) {
                        console.log('There is only ' + data.Quantity + ' available');
                        return data
                    }
                    else {
                        //   console.log(data.Amount * args.quantity);
                        let detail = new Purchaseproduct({
                            userid: args.userId,
                            Email: args.Email,
                            Productid: args.productid,
                            Productname: args.productname,
                            quantity: args.quantity,
                            Amount: data.Amount * args.quantity
                        });
                        detail.save();
                        var final = Number(data.Quantity) - Number(args.quantity)
                        adminaddproduct.update({ _id: args.productid }, { Quantity: final }, (err, res) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(res)
                            }
                        });
                        console.log('=======');
                    }

                }).catch((err) => console.log(err))

            }

        },

        deleteuser: {
            type: deletetheuser,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return mlabsignup.findByIdAndRemove({ _id: args.id })
            }
        }

    }
})

module.exports = new GraphQLSchema({
    query: Rootquery,
    mutation: Mutation
})