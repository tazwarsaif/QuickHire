const bcrypt = require('bcrypt');
const pool = require('../util/database');

exports.recDashboard = async (req,res,next)=>{
    const {username,name, email, phone, password, organization} = req.body;
    const hasedPass = await bcrypt.hash(password,10);
    const res1 = await pool.query(`Insert into user (username,user_type,password) values (?,'Recruiter',?)`,[username,hasedPass]);
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const tempid = temp[0][0].id;
    const res2 = await pool.query(`Insert into recruiter (rec_uid,name,phone,email,organization) values (?,?,?,?,?)`,[tempid,name,phone,email,organization]);
    console.log('Signup Successful')
    res.redirect('dashboard/recruiter')
}

exports.recView = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from recruiter where rec_uid=?',[rid]);
    const recruiter = [temp1[0][0]];
    res.render('dashboard-recruiter', {type:req.session.user.type,recruiter});
}

exports.editRec = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from recruiter where rec_uid=?',[rid]);
    const recruiter = [temp1[0][0]];
    res.render('recedit',{type:'Edit Recruiter',recruiter,rec_uid:rid})
}

exports.receditPost = async (req,res,next) => {
    const {name,phone,email,organization} = req.body;
    const res1 = await pool.query("UPDATE recruiter SET name = ?, phone = ?, email =?, organization=? WHERE rec_uid=?",[name,phone,email,organization,req.query.jid])
    res.redirect("/dashboard/recruiter")
}

exports.addJobPostView = (req,res,next) => {
    res.render('add-post',{type:'Add Job Post'})
}
exports.addJobPost = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id;
    const {title,type,skills,description} = req.body;
    const res1 = await pool.query(`Insert into jobpost (title,recruiter_id,type,description,skills) values (?,?,?,?,?)`,[title,rid,type,description,skills]);
    res.redirect("/recruiter/addjobs")
}

exports.myPostedJobs = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobpost where recruiter_id=?',[rid]);
    res.render('recPostedJobs', {type: 'Posted Job',jobs:temp1[0]});
}

exports.editJobPost = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobpost where recruiter_id=? and pid=?',[rid,req.query.job_id]);
    res.render('editjob',{type:"Job Post",job:temp1[0],jid:temp1[0][0].pid});
}

exports.editJobPostPost = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobpost where recruiter_id=? and pid=?',[rid,req.query.job_id]);
    const {title,type,skills,description} = req.body;
    const res1 = await pool.query("UPDATE jobpost SET title = ?, type = ?, skills=?, description=? WHERE pid=?",[title,type,skills,description,req.query.jid])
    res.redirect('/recruiter/postedjobs')
}

exports.DeletePostedJobs = async (req,res,next) => {
    const id = req.body.pid;
    const res1 = await pool.query("Delete from jobpost where pid=?",[id]);
    res.redirect('/recruiter/postedjobs')
}