const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const router = express.Router();

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        res.redirect("/")
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        console.log("Secured...")
        next();
    }catch(error){
        res.redirect('/');
    }
}


router.get('/',(req,res,next)=>{
    res.render('login');
})

router.post('/login',async (req,res,next)=>{
    const {username, password} = req.body;
    console.log(username,password);
    const user = await User.findOne({ username:username });
    if(!user){
        console.log('Username does not exist');
        res.redirect("/");
    }
    const verified = await bcrypt.compare(password,user.password);
    if(!verified){
        console.log("password is wrong")
        res.redirect('/');
    }
    console.log("Log in successful");
    const token = jwt.sign({userId: user._id},jwtSecret);
    res.cookie('token',token,{httpOnly:true});
    res.redirect('/dashboard')
})

router.post('/register',async (req,res,next)=>{
    const {username, password} = req.body;
    const hashedpass = await bcrypt.hash(password,10);
    const user = await User.create({username:username,password:hashedpass});
    console.log(user);
    res.redirect('/');
})

router.get("/dashboard",authMiddleware,(req,res,next)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token,jwtSecret)
    User.findOne({_id:decoded.userId})
    .then((result)=>{
        console.log(result);
        res.render('dashboard');
    })
})

router.post('/logout',(req,res,next)=>{
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;