const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req, res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const {name, password} = req.body;
                const user = new User({name, password});

                user.save((err, user) => {
                    if (!err) {
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;    
                    }
                    res.status(status).send(result);
                })
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        })
    },

    login: (req, res) => {
        const { name, password } = req.body;
    
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
          let result = {};
          let status = 200;
          if(!err) {
            User.findOne({name}, (err, user) => {
              if (!err && user) {
                // We could compare passwords in our model instead of below
                bcrypt.compare(password, user.password).then(match => {
                  if (match) {
                    status = 200;

                    const payload = {user: user.name};
                    const options = {expiresIn: '2d', issuer: 'https://scotch.io'};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    result.token = token;
                    result.status = status;
                    result.result = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                  }
                  res.status(status).send(result);
                }).catch(err => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                });
              } else {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
              }
            });
          } else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
    },

    getAll: (req, res) => {
        console.log("first");
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            console.log("2nd");
            if (!err) {
                const payload = req.decoded;
                console.log("3rd");
                console.log('PAYLOAD', payload)
                if (payload && payload.user === 'admin') {
                    
                    console.log("4th");
                    // User.find({}, (err, users) => {
                    //     if(!err) {
                    //         console.log("5th");
                    //         result.status = status;
                    //         result.error = err;
                    //         result.result = users;
                    //         //console.log(users)
                    //     } else {
                    //         console.log("6th")
                    //         status = 500;
                    //         result.status = status;
                    //         result.error = err;
                    //     }
                    //     res.status(status).send(result);
                    // });
                    User.find({})
                    .then(result => res.json(result))
                    .catch(err => console.log(err));
                     ;

                } else {
                    console.log("7th")
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status);
                }
            } else {
                console.log("8th")
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status);
            }            
        });
    },
};
