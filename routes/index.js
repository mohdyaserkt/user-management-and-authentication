var express = require('express');
var router = express.Router();
var promise=require('promise')
var collection=require('./mongodb')
let msg;
var bcrypt=require('bcrypt');
const nocache = require('nocache');
const session = require('express-session');

router.get('/home', function(req, res, next) {
  if(req.session.user){
    res.render('home',{msg})
  }else{
    res.redirect('/login')
  }

})
router.get('/login',nocache(), function(req, res, next) {

  

  if(req.session.user){
    res.redirect('/home')
  }
  else{res.render('login')}
  
})





/* GET signup  page. */
router.get('/signup',nocache(), function(req, res, next) {
  if(req.session.user){
    res.redirect('/home')
  }
  else{
    res.render('signup')
  }
  
});



router.post('/signup',async(req,res,next)=>{
  console.log(req.body)

  
  const data={
    name:req.body.name,
    username:req.body.username,
    password:req.body.password,
    phone:req.body.phone
  }

  async function existchecking(){
  let user=await collection.findOne({username:data.username})
  if(user==null){
                data.password=await bcrypt.hash(data.password,10)
                   await collection.insertMany([data])
                   msg=data.name
                   req.session.user=data.username;
                  res.redirect('/home')
                }
  
            else{
                    console.log("signup failed");
                }
       }

 existchecking()

})

/* GET login  page. */


router.post('/login',async(req,res,next)=>{

  
  checking(req.body).then(async(details)=>{
        console.log("login confirmed!!!");
        let user=await collection.findOne({username:details.username})
        console.log(user.name);
        msg=user.name
        req.session.user=details.username;
        res.redirect('/home')
  }).catch((status)=>{
      
      if(status.username==false){
        res.render('login',{title:"entered username is incorrect"})
      }
      else if(status.password==false){
        res.render('login',{title:"entered password is incorrect"})
      }

  })

})


//checking

 function checking(details){

  return new promise(async(resolve,reject)=>{
      var status={
        username:false,
        password:false
      }

    let user=await collection.findOne({username:details.username})
    if(user){
      status.username=true

     let a=await bcrypt.compare(details.password,user.password)
       
      
       if(a==true){
         status.password=true
         resolve(details)
       }
      
    }
    reject(status)

  })
  
}

//logout

router.get('/logout',(req,res)=>{

  req.session.user=null
  res.redirect('/login')

})


/* GET home  page. */

module.exports = router;

