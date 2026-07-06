const bcrypt=require('bcrypt');

const Administrator=require('../models/administrator');

exports.loginPage=(req,res)=>{

res.render('login',
{
title:'Login'
});

};

exports.login=async(req,res)=>{

const {username,password}=req.body;

const admin=await Administrator.findOne({

where:{username}

});

if(!admin){

req.flash('error','Invalid Username');

return res.redirect('/login');

}

const match=await bcrypt.compare(password,admin.password);

if(!match){

req.flash('error','Invalid Password');

return res.redirect('/login');

}

req.session.admin={

id:admin.admin_id,

name:admin.full_name

};

res.redirect('/dashboard');

};

exports.logout=(req,res)=>{

req.session.destroy(()=>{

res.redirect('/login');

});

};