const express = require('express');
const session = require('express-session');
const path = require('path');
const MuSqlStore = require('express-mysql-session')(session);
const mainRouter = require('./routes/main');
const pool = require('./util/database');
require('dotenv').config();

const app = express()

app.set('view engine','ejs');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/recruiter'),
    path.join(__dirname, 'views/jobseeker')
  ]);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'resume')));

const sessionStore = new MuSqlStore({},pool);

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'my-secret-key',
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    })
)

app.use(mainRouter)

app.listen(5000,()=>{
    console.log("Listening to port 5000....")
})