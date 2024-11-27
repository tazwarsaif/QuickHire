const express = require('express')
const bcrypt = require('bcrypt');
const portalController = require('../controller/portal');
const pool = require('../util/database');
const router = express.Router()

const authMiddleware = (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        return res.redirect('login');
    }
    next();
}

router.get('/',portalController.homePortal)

router.get('/login',portalController.loginView)

router.get('/signup',portalController.signup)

router.post('/recruiter',portalController.recDashboard)

router.post('/jobseeker',portalController.seekDashboard)

router.post('/login',portalController.login)

router.get('/dashboard',authMiddleware,portalController.dashboard)

router.post("/logout",portalController.logout)


module.exports = router;