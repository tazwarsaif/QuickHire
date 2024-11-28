const bcrypt = require('bcrypt');
const pool = require('../util/database');



exports.homePortal = (req,res,next)=>{
    res.redirect('home')
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
    if(user[0][0].user_type == 'Job Seeker'){
        res.redirect('dashboard/jobseeker')
    }else{
        res.redirect("dashboard/recruiter")
    }
}

exports.signup = async (req,res,next)=>{
    const result = await pool.query('Select username from user')
    res.render('signup', {result,type:'signup'});
}

exports.logout = (req,res,next)=>{
    res.clearCookie('token');
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Log out successful");
        }
        res.redirect("login");
    })
}

exports.homeView = async (req,res,next) => {
    const temp = await pool.query(`Select * from jobpost`);
    const jobs = temp[0]
    if(req.query.job_id){
        const temp1 = await pool.query('Select * from jobpost where pid=?',[req.query.job_id]);
        const thejob = temp1[0][0]
        console.log(thejob)
        res.render('jobview',{type:'Job View',thejob});
        return
    }
    res.render('homeview',{type:'Home',jobs});
}
