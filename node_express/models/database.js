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

User.comparePass =  function(password)  {
    console.log('BCRYPT WORKING!');
    console.log(bcrypt.compareSync(password,'2927456'));
    console.log('BCRYPT WORKING!');
    return bcrypt.compareSync(password,this.password)
};
module.exports.User = User;
