'use strict';
const express = require('express');
const bearerAuth = require('./middleware/bearer.js');
const router = express.Router();

router.get('/secret', bearerAuth , bearerMiddleware );

function bearerMiddleware(req,res){
  res.json(res.user);
}

module.exports = router;