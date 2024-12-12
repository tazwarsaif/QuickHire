const bcrypt = require('bcrypt');
const pool = require('../util/database');



exports.homePortal = (req,res,next)=>{
    res.redirect('home')
}

exports.dashboard = (req,res,next)=>{
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
        res.redirect('/home')
    }else{
        res.redirect("/home")
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
        res.render('jobview',{type:'Job View',thejob});
        return
    }
    const user = [];
    if(req.session.user){
        if(req.session.user.type === "Job Seeker"){
            const forseekid = await pool.query('select id,username from user where username=?',[req.session.user.username])
            const seek_id = forseekid[0][0].id;
            const username = forseekid[0][0].username;
            const temp3 = await pool.query('select * from jobseeker where seeker_uid=?',[seek_id])
            const user = temp3[0]
            const temp2 = await pool.query('select count(application_id) as count , seeker_id from applicationtracking where seeker_id = ? group by seeker_id',[seek_id])
            let applied = 0
            if(temp2[0].length>0){
                applied = temp2[0][0].count;
            }
            return res.render('homeview',{type:'Home',jobs,applied,user,username});
        }else{
            const forrec = await pool.query('select id from user where username=?',[req.session.user.username])
            const recSearch = await pool.query('select * from recruiter where rec_uid=?',[forrec[0][0].id])
            const recruiter = recSearch[0];
            return res.render('recHomeview', {type: 'Recruiter Home View',recruiter,jobs})
        }
        
    }
    res.render('homeview',{type:'Home',jobs,user:null});
}
