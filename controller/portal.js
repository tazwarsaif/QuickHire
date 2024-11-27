const bcrypt = require('bcrypt');
const pool = require('../util/database');



exports.homePortal = (req,res,next)=>{
    res.redirect('dashboard')
}

exports.dashboard = (req,res,next)=>{
    console.log(req.session.user.type);
    const user = req.session.user;
    if(req.session.user.type=== 'Job Seeker'){
        res.render('dashboard-jobseeker', {type:req.session.user.type});
    }else{
        res.render('dashboard-recruiter', {type:req.session.user.type});
    }
}

exports.loginView = (req,res,next)=>{
    console.log(req.session);
    res.render('login',{type:'login'});
}

exports.login = async (req,res,next)=>{
    const {username, password} = req.body;
    const user = await pool.query(`Select username,password,user_type from user where username=?`,[username]);
    if(user[0].length==0){
        console.log('Username does not exist');
        return res.redirect("/?flaw=invalid_credential");
    }
    const verified = await bcrypt.compare(password,user[0][0].password);
    if(!verified){
        console.log("password is wrong")
        return res.redirect('/?flaw=invalid_credential');
    }
    console.log("Log in successful");
    req.session.user = { username , type: user[0][0].user_type};
    res.redirect('dashboard')
}

exports.signup = async (req,res,next)=>{
    const result = await pool.query('Select username from user')
    res.render('signup', {result,type:'signup'});
}

exports.recDashboard = async (req,res,next)=>{
    const {username,name, email, phone, password, organization} = req.body;
    const hasedPass = await bcrypt.hash(password,10);
    const res1 = await pool.query(`Insert into user (username,user_type,password) values (?,'Recruiter',?)`,[username,hasedPass]);
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const tempid = temp[0][0].id;
    const res2 = await pool.query(`Insert into recruiter (rec_uid,name,phone,email,organization) values (?,?,?,?,?)`,[tempid,name,phone,email,organization]);
    console.log('Signup Successful')
    res.redirect('/');
}

exports.seekDashboard = async (req,res,next)=>{
    const {username,name, email, phone, password, skillset} = req.body;
    const hasedPass = await bcrypt.hash(password,10);
    const res1 = await pool.query(`Insert into user (username,user_type,password) values (?,'Job Seeker',?)`,[username,hasedPass]);
    const temp = await pool.query(`Select id from user where username=?`,[username]);
    const tempid = temp[0][0].id;
    const res2 = await pool.query(`Insert into jobseeker (seeker_uid,name,phone,email,skills) values (?,?,?,?,?)`,[tempid,name,phone,email,skillset]);
    console.log('Signup Successful')
    res.redirect('/');
}

exports.logout = (req,res,next)=>{
    res.clearCookie('token');
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Log out successful");
        }
        res.redirect("/");
    })
}