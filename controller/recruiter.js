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
    res.redirect('/login')
}

exports.recView = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from recruiter where rec_uid=?',[rid]);
    const recruiter = [temp1[0][0]];
    
    res.render('recruiter/dashboard-recruiter', {type:req.session.user.type,recruiter});
}

exports.editRec = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from recruiter where rec_uid=?',[rid]);
    const recruiter = [temp1[0][0]];
    res.render('recruiter/recedit',{type:'Edit Recruiter',recruiter,rec_uid:rid})
}

exports.receditPost = async (req,res,next) => {
    const {name,phone,email,organization} = req.body;
    const res1 = await pool.query("UPDATE recruiter SET name = ?, phone = ?, email =?, organization=? WHERE rec_uid=?",[name,phone,email,organization,req.query.jid])
    res.redirect("/dashboard/recruiter")
}

exports.addJobPostView = (req,res,next) => {
    
    res.render('recruiter/add-post',{type:'Add Job Post'})
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
    const temp2 = await pool.query("SELECT jp.pid AS job_post_id, COUNT(at.seeker_id) AS number_of_applicants, COUNT(CASE WHEN at.status = 'pending' THEN 1 END) AS Pending, COUNT(CASE WHEN at.status = 'accepted' THEN 1 END) AS Accepted, COUNT(CASE WHEN at.status = 'rejected' THEN 1 END) AS Rejected FROM jobPost jp LEFT JOIN applicationTracking at ON jp.pid = at.job_id GROUP BY jp.pid");
    res.render('recruiter/recPostedJobs', {type: 'Posted Job',jobs:temp1[0],applicantstatus: temp2[0]});
}

exports.editJobPost = async (req,res,next) => {
    const username = req.session.user.username;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id
    const temp1 = await pool.query('Select * from jobpost where recruiter_id=? and pid=?',[rid,req.query.job_id]);
    res.render('recruiter/editjob',{type:"Job Post",job:temp1[0],jid:temp1[0][0].pid});
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

exports.DetailedJobView = async (req,res,next)=>{
    const job_id = req.query.job_id;
    const temp = await pool.query('Select * from applicationtracking where job_id=?',[job_id]);
    const temp1 = await pool.query('Select * from jobpost where pid=?',[job_id]);
    const temp2 = await pool.query('select at.application_id as application_id, js.name as name, at.status as status, at.path_link as path_link, js.email as email, at.interview_session as interview_session from applicationtracking at inner join jobseeker js on js.seeker_uid = at.seeker_id and at.job_id=?',[job_id]);
    const username = req.session.user.username;
    const temp3 = await pool.query(`Select id from user where username=?`,[username]);
    const temp4 = await pool.query("Select interview_id,title from interview_session where rec_uid=?",[temp3[0][0].id])
    res.render('recruiter/recJobDetailedView',{type:'Detailed View',job:temp1[0],names:temp2[0],interviews:temp4[0]})
}

exports.InterviewSessionView = async (req,res,next) => {
    const res1 = await pool.query("SELECT i.interview_id as sessionid, i.title as title, i.date as date, i.start_time as stime, i.end_time as etime, COUNT(a.application_id) AS number_of_applicants FROM interview_session i LEFT JOIN applicationtracking a ON i.interview_id = a.interview_session GROUP BY i.interview_id");
    res.render('recruiter/interviewSession',{type:'Interview Session',interviews:res1[0]});
}
exports.InterviewSessionViewPost = async (req,res,next) => {
    const username = req.session.user.username;
    const {title,date,stime,etime} = req.body;
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const rid = temp[0][0].id;
    const res1 = await pool.query(`Insert into interview_session (rec_uid,title,date,start_time,end_time) values (?,?,?,?,?)`,[rid,title,date,stime,etime]);
    res.redirect('/recruiter/interviewsession');
}

exports.selectinterview = async (req,res,next) => {
    const app_id =  Number(req.query.app_id);
    if(req.query.interviewselect === "null"){
        const res1 = await pool.query("select * from applicationtracking where application_id=?",[app_id])
        const res2 = await pool.query("UPDATE applicationtracking set interview_session=? where application_id=?",[null,app_id]);
        return res.redirect(`http://localhost:5000/recruiter/detailedjobview?job_id=${res1[0][0].job_id}`)
    }
    const selectid = Number(req.query.interviewselect);
    const res2 = await pool.query("UPDATE applicationtracking set interview_session=? where application_id=?",[selectid,app_id]);
    const res1 = await pool.query("select * from applicationtracking where application_id=?",[app_id])
    res.redirect(`http://localhost:5000/recruiter/detailedjobview?job_id=${res1[0][0].job_id}`)
}
exports.InterviewDetailedView = async (req,res,next) => {
    const i_id = req.params.id;
    const temp2 = await pool.query('select at.application_id as application_id, js.name as name, at.status as status, at.path_link as path_link, js.email as email, at.interview_session as interview_session from applicationtracking at inner join jobseeker js on js.seeker_uid = at.seeker_id and at.interview_session=?',[i_id]);
    const temp3 = await pool.query('select * from interview_session where interview_id=?',[i_id]);
    res.render('recruiter/interviewDetailedView',{type:'Interview Detailed View',interviewees: temp2[0],interview:temp3[0]})
}
exports.ChangeInterviewStatus = async (req,res,next)=>{
    const {app_id,interviewstatus,session} = req.query;
    const res1 = await pool.query("UPDATE applicationtracking SET status = ? where application_id=?",[interviewstatus,app_id])
    res.redirect(`/recruiter/interviewsession/${session}`)
}