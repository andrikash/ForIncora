const express = require('express');
const UserDB = require('../models/database').User;
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const token = require('../token');

const app = express();
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended: true}));

const hashPass = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return false;
            bcrypt.hash(password, salt)
                .then((res) => resolve(res))
                .catch(er => reject(er));
        });
    });
};



router.post('/login',async (req,res) => {
    let user;
    try {
        user = await UserDB.findOne({ where: {email: req.body.email}});
        console.log(user);
        const isOk = await UserDB.comparePass(req.body.password);

        if (!isOk) {
            res.sendStatus(403);
            res.send({message: 'bad password'});
        }

        if (!user) {
            res.status(404);
            res.send({ error: 'user not found' });
        }
        // token = await jwt.sign({ user }, 'secretkey', { expiresIn: 1000*60*60*24*365 });

        if (!req.session) {
            req.session = {}
        }
        req.session.token = token.accessAndRefresh();
    } catch ({ message }) {
        res.status(500);
        res.send({ error: message });
    }
    res.send({ token, user });
});


//Just a start page
router.get('/', (req, res) => {
    res.send('Hello');
});
//Add new user
router.post('/users', async (req, res) => {
    let userTemp = new UserDB(req.body);
    const hashed = await hashPass(userTemp.password);
    userTemp.password = hashed;
    console.log(userTemp.dataValues);
    UserDB.create(userTemp.dataValues).then(function () {
        res.send('Check changes');
    }).catch(function (err) {
        res.status(400).send(err.name);
    });
});
//Get a user by id
router.get('/users/:id', (req, res) => {
    UserDB.findById(req.params.id).then((user) => {
        res.send(user.dataValues);
    }).catch((err) => {
        res.send(err.name);
    })
});
//Update user's information
router.put('/users/:id', (req, res) => {
    UserDB.findById(req.params.id).then((user) => {
        user.updateAttributes(req.body);
    }).then(function () {
        res.sendStatus(200);
    }).catch((err) => {
        res.send(err.name);
    })
});

module.exports = router;
