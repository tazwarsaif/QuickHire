const bcrypt = require('bcrypt');
const pool = require('../util/database');

exports.seekDashboard = async (req,res,next)=>{
    const {username,name, email, phone, password, skillset} = req.body;
    const hasedPass = await bcrypt.hash(password,10);
    const res1 = await pool.query(`Insert into user (username,user_type,password) values (?,'Job Seeker',?)`,[username,hasedPass]);
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const tempid = temp[0][0].id;
    const res2 = await pool.query(`Insert into jobseeker (seeker_uid,name,phone,email,skills) values (?,?,?,?,?)`,[tempid,name,phone,email,skillset]);
    console.log('Signup Successful')
    res.render('dashboard-recruiter', {type:req.session.user.type});
}

exports.seekView = (req,res,next) => {
    res.render('dashboard-jobseeker', {type:req.session.user.type});
}