const bcrypt = require('bcrypt');
const pool = require('../util/database');
const multer = require('multer')



exports.seekDashboard = async (req,res,next)=>{
    const {username,name, email, phone, password, skillset} = req.body;
    const hasedPass = await bcrypt.hash(password,10);
    const res1 = await pool.query(`Insert into user (username,user_type,password) values (?,'Job Seeker',?)`,[username,hasedPass]);
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const tempid = temp[0][0].id;
    const res2 = await pool.query(`Insert into jobseeker (seeker_uid,name,phone,email,skills) values (?,?,?,?,?)`,[tempid,name,phone,email,skillset]);
    console.log('Signup Successful')
    res.render('/login');
}

exports.seekView = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const jid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobseeker where seeker_uid=?',[jid]);
    const seeker = [temp1[0][0]];
    res.render('dashboard-jobseeker', {type:req.session.user.type,seeker});
}

exports.seekeditView = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const jid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobseeker where seeker_uid=?',[jid]);
    const seeker = [temp1[0][0]];
    res.render('jobseekedit',{type:'Edit Seeker',seeker,seeker_uid:jid})
}

exports.seekeditPost = async (req,res,next) => {
    const {name,phone,email,skills} = req.body;
    const res1 = await pool.query("UPDATE jobseeker SET name = ?, phone = ?, email =?, skills=? WHERE seeker_uid=?",[name,phone,email,skills,req.query.jid])
    res.redirect("/dashboard/jobseeker")
}

exports.seekApply = async (req,res,next) =>{
    const jid = req.query.job_id;
    if(!jid){
        return res.redirect('/home');
    }
    const temp = await pool.query("Select id from user where username=?",[req.session.user.username]);
    const jobsearch = await pool.query("select * from jobpost where pid=?",[jid])
    res.render('applypage',{type:'Apply page',job:jobsearch[0],seeker_id:temp[0]})
}

exports.seekApplied = async (req,res,next) =>{
    console.log(req.body);
    res.redirect("/home");
}

exports.appliedJobs = async (req,res,next) =>{
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const jid = temp[0][0].id
    const temp1 = await pool.query('select at.interview_session as interview_session, jp.title as job_title, jp.pid as postid, jp.type as job_type, inter.date, inter.start_time as s_time, inter.end_time as e_time from applicationtracking at right join jobpost jp on at.job_id = jp.pid and at.seeker_id=12 left join interview_session inter on at.interview_session=inter.interview_id where jp.pid=at.job_id AND (inter.date IS NULL OR (inter.date = CURDATE() AND inter.start_time > CURTIME()) OR (inter.date > CURDATE()))',[jid]);
    res.render("jobseeker/appliedJobs",{applied:temp1[0]})
}