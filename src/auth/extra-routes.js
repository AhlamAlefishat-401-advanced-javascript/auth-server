'use strict';
const express = require('express');
const basicAuth=require('./middleware/basic');
const bearerAuth = require('./middleware/bearer.js');
const acl=require('./middleware/acl.js');
const users=require('./models/users/users-model.js');
const router = express.Router();

router.get('/secret', bearerAuth , bearerMiddleware );

function bearerMiddleware(req,res){
  res.json(res.user);
}
router.post('/signin', basicAuth, (req, res)=> {
  res.status(200).send(req.token);
});

router.get('/protected-route', bearerAuth, (req, res)=> {
  res.status(200).json(req.user);
});

router.get('/public-route',(req, res)=> {
  res.status(200).send('public-route response !! ');
});


router.get('/list' , (req, res)=> {
  res.status(200).send(users.list());
});

router.post('/create', bearerAuth, acl('create'), (req, res)=> {
  res.status(201).send('created !! ');
});

router.get('/read', bearerAuth, acl('read'), (req, res)=> {
  res.status(200).send('Allowed reading !!');
});
module.exports = router;