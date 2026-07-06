const express=require('express');

const router=express.Router();

const auth=require('../controllers/auth.controller');

router.get('/login',auth.loginPage);

router.post('/login',auth.login);

router.get('/logout',auth.logout);

module.exports=router;