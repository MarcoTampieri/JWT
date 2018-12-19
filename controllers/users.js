const routes = require('./../routes/index.js')

// app.use('/api/v1', routes(router));

module.exports = {
    add: (req, res) => {
        return
    }
};

const mongoose = require('mongoose');
const User = require('../models/users');

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
    }
}