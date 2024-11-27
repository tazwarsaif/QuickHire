const express = require('express')
const portalController = require('../controller/portal');
const jobseekerController = require('../controller/jobseeker');
const recruiterController = require('../controller/recruiter');
const router = express.Router()

const authMiddleware = (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        return res.redirect('login');
    }
    next();
}

//Log in, Sign Up and Sign Out

router.get('/',portalController.homePortal)

router.get('/signup',portalController.signup)

router.get('/login',portalController.loginView)

router.post('/login',portalController.login)

router.post("/logout",portalController.logout)

//In general Dashboard

// router.get('/dashboard',authMiddleware,portalController.dashboard)
router.get('/home',portalController.homeView)

//For Recruiter

router.post('/recruiter',recruiterController.recDashboard)
router.get('/dashboard/recruiter',recruiterController.recView)

//For Job Seeker

router.post('/jobseeker',jobseekerController.seekDashboard)
router.get('/dashboard/jobseeker',jobseekerController.seekView)

module.exports = router;