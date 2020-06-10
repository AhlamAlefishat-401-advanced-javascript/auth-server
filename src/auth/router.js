const express = require('express');
const router = express.Router();
const users = require('./models/users/users-model.js');
const basicAuth = require('./middleware/basic.js');
const oauth=require('./middleware/oauth.js');

router.post('/signup', save);
router.post('/signin', basicAuth,signin);
router.get('/users' , list);
router.get('/oauth', oauth , oAuth);


async function save (req,res){
  // console.log('body',req.body);

  try{
    // console.log('body',req.body);
  
    const user = await users.save(req.body);
    // console.log('user',user);
    const token = users.generateToken(user);
    // console.log('token',token);
    res.json({token});
    
  }catch(err){
    res.status(403).send('user already exists');
  }

}

function signin (req, res) {
  res.json({ token: req.token , user: req.user });
}

async function list(req,res){
  const allUsers = await users.get({});
  res.json( {users : allUsers} );
}
function oAuth(req,res){
  res.json({ token : req.token });
}


module.exports = router;





