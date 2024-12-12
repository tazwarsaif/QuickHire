const express = require('express')
const portalController = require('../controller/portal');
const jobseekerController = require('../controller/jobseeker');
const recruiterController = require('../controller/recruiter');
const bcrypt = require('bcrypt');
const pool = require('../util/database');
const multer = require('multer')
const router = express.Router()

const authMiddleware = (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        return res.redirect('/login?msg=loginfirst');
    }
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './resume')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })

const upload = multer({ storage: storage })

async function applyStore (req,res,next) {
    const filename = `${req.file.filename}`
    const insertingapplication = pool.query("INSERT INTO applicationtracking (job_id, seeker_id, path_link) VALUES (?,?,?)",[req.body.job_id,req.body.seeker_id,filename])
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
router.get('/dashboard/recruiter/edit',recruiterController.editRec)
router.post('/dashboard/recruiter/edit',recruiterController.receditPost)
router.get('/recruiter/addjobs',recruiterController.addJobPostView)
router.post('/recruiter/addjobs',recruiterController.addJobPost)
router.get('/recruiter/editjob',recruiterController.editJobPost)
router.post('/recruiter/editjob',recruiterController.editJobPostPost)
router.get('/recruiter/postedjobs',recruiterController.myPostedJobs)
router.get('/recruiter/changeinterviewsession',recruiterController.selectinterview)
router.get('/recruiter/interviewsession',recruiterController.InterviewSessionView)
router.post('/recruiter/interviewsession',recruiterController.InterviewSessionViewPost)
router.get('/recruiter/interviewsession/:id',recruiterController.InterviewDetailedView)
router.get('/recruiter/changestatus',recruiterController.ChangeInterviewStatus)
router.post('/recruiter/deletejob',recruiterController.DeletePostedJobs)
router.get('/recruiter/detailedjobview',recruiterController.DetailedJobView)

//For Job Seeker

router.post('/jobseeker',jobseekerController.seekDashboard)
router.get('/dashboard/jobseeker',authMiddleware,jobseekerController.seekView)
router.get('/dashboard/jobseeker/edit',authMiddleware,jobseekerController.seekeditView)
router.post('/dashboard/jobseeker/edit',authMiddleware,jobseekerController.seekeditPost)
router.get('/home/apply',authMiddleware,jobseekerController.seekApply)
router.post('/apply',authMiddleware,upload.single("uploadresume"),applyStore,jobseekerController.seekApplied)

module.exports = router;