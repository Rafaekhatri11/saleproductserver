const express = require('express');
const router = express.Router();
const adminuser = require('./admin');
const mlabsignup = require("./createuser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
   const body = JSON.parse(req.body.json);
    mlabsignup.find({ "Email": body.Email })
        .then(user => {
            if (user.length >= 1) {
                return res.status(201).json({
                    message: "This email address is already exist please try a new one"
                });
            } else {
                bcrypt.hash(body.Pass, 10, (err, hash) => {
                    console.log(req)
                    if (err) {
                        
                        return res.status(201).json({
                            message: err
                        });
                    } else {
                        
                        const User = new mlabsignup({
                            //  id : new mongoose.Types.ObjectId,
                            Email: body.Email,
                            Name: body.Name,
                            Pass: hash
                        });

                        User.save()
                            .then(result => {
                                console.log("======",result);
                                const token = jwt.sign({
                                    email: result.Email,
                                    userId: result._id
                                }, 'secret',
                                    {
                                        expiresIn: '1h'
                                    }
                                )
                                res.status(201).json({
                                    message: 'Register Successfully',
                                    token: token
                                })
                                
                            })
                            .catch(err => {
                                res.status(201).json({
                                    message: err
                                });
                            });
                    }

                })
            }
        })


});


router.post('/adminsignup',(req,res,next)=>{
    adminuser.find({ "Email": req.body.Email })
    .then(user => {
        if (user.length >= 1) {
            return res.status(201).json({
                message: "This admin email address is already exist please try a new one"
            });
        } else {
            bcrypt.hash(req.body.Pass, 10, (err, hash) => {
                console.log(req)
                if (err) {
                    
                    return res.status(500).json({
                        message: err
                    });
                } else {
                   
                    const User = new adminuser({
                        //  id : new mongoose.Types.ObjectId,
                        Email: req.body.Email,
                        Name: req.body.Name,
                        Pass: hash
                    });

                    User.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Admin User created'
                            })
                        })
                        .catch(err => {
                            res.status(201).json({ 
                                message: err
                            });
                        });
                }

            })
        }
    })

});

router.post('/adminlogin', (req,res,next)=>{
    const body=JSON.parse(req.body.json);

    adminuser.find({"Email": body.Email }).exec()
    .then(user => {
        console.log(user)
        if (user.length < 1) {
            return res.status(200).json({
                message: 'Auth Failed'
            });
        }
        bcrypt.compare(body.Pass, user[0].Pass, (err, result) => {
            if (err) {
                
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].Email,
                    userId: user[0]._id
                }, 'secret',
                    {
                        expiresIn: '1h'
                    }
                )
                return res.status(200).json({
                    message: ' Admin Successfully Log In',
                    token : token
                })
            }
           
            res.status(200).json({
                message: 'Auth Failed'
                
            })
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: err
        })
    })
})

router.post("/login", (req, res, next) => {
    const body=JSON.parse(req.body.json);
    mlabsignup.find({"Email": body.Email }).exec()
        .then(user => {
            console.log(user)
            if (user.length < 1) {
                return res.status(200).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(body.Pass, user[0].Pass, (err, result) => {
                if (err) {
                    
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].Email,
                        userId: user[0]._id
                    }, 'secret',
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(200).json({
                        message: 'Successfully Log In',
                        token : token,
                        Email: body.Email
                    })
               
                }
               
                res.status(200).json({
                    message: 'Auth Failed'
                    
                })
            });
        }).catch(err => {
            console.log(err);
            return res.status(401).json({
                message: err
            })
        })
})

router.delete("/:userId", (req, res, next) => {
    mlabsignup.remove({ _id: req.params.userId }).exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            })
        })
})




module.exports = router;