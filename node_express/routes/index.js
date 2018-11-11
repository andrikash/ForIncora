const express = require('express');
const UserDB = require('../models/database').User;
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const token = require('../token');
const session = require('express-session');

const app = express();
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true
}));

const hashPassword = (password) => {
    // generate a salt
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return false;
            // hash the password along with our new salt
            bcrypt.hash(password, salt)
                .then((res) => resolve(res))
                .catch(er => reject(er));
        });
    });
};



router.post('/login',async (req,res) => {
    let token;
    let user;
    try {

        let email = req.body.email;
        user = await UserDB.findOne({email: email});
        //An comparison between outPass and databasePass
        const isOk = bcrypt.compareSync(req.body.password,user.password);

        //Find out why this parts don't working
        if (!isOk) {
            res.sendStatus(403);
            res.send({message: 'bad password'});
        }

        if (!user) {
            res.status(404);
            res.send({ error: 'user not found' });
        }

        token = await jwt.sign({id: user.id },'secretkey',{ expiresIn: 1000*60*60*24*365 });

        if (!req.session) {
            req.session = {}
        }
        req.session.token = token;

    } catch ({ message }){
        res.status(500);
        res.send({ error: message });
    }
    res.send({ token, user });
});


//Just a start page
router.get('/', (req, res) => {
    UserDB.findOne({email: 'bobdy@gmail.com'}).then((user)=>{
        console.log(user.dataValues);
    });
    res.send('Hello');
});
//Add new user
router.post('/users', async (req, res) => {
    let userTemp = new UserDB(req.body);
    const hashed = await hashPassword(userTemp.password);
    userTemp.password = hashed;
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
