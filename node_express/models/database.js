const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize("postgres://postgres:root@localhost:5432/todo");
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
        required: true,
        validate: {
            isAlpha: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true
        }
    },
    email:{
        type: Sequelize.STRING,
        unique: true,
        required: true,
        match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        validate: {
            isEmail : true
        }
    },
    phone: {
        type: Sequelize.BIGINT,
        match:/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
        validate: {
            isNumeric: true
        }
    },
    password: {
        type: Sequelize.STRING
    }
});
User.sync({force: true}).then(() => {
});
//     User.findAll().then(function (users) {
//         users.forEach(function (user) {
//             console.log(user.firstName);
//         });
//     });
    // User.findAll()
    //     .then(function (users) {
    //    let user =  users.find(function(user) {
    //         return +user.id === 2;
    //     });
    //     console.log(user.firstName);
    // });

User.comparePass = function (password){
    return bcrypt.compareSync(password,this.password)
};
module.exports.User = User;
