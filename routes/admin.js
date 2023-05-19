var express = require('express');
var router = express.Router();
var collection=require('./adminmongodb')
var promise=require('promise')
var usercollection=require('./mongodb')
var msg
var bcrypt=require('bcrypt');
const nocache = require('nocache');
/* GET users listing. */
router.get('/',nocache(), async function(req, res, next) {

    if(req.session.admin){
        var imp =await usercollection.find({})
  res.render('admin',{imp,message:msg})
    }
    else{

        
            res.redirect('/admin/login')
        
    }
    
});


router.get('/login',nocache(),(req,res,next)=>{

    if(req.session.admin){
        res.redirect('/admin')
    }
    else{
    res.render('adminlogin',{message:msg})}
})

router.post('/login',async(req,res,next)=>{
    var data=req.body
    checking(data).then(async(details)=>{
        console.log(" admin login confirmed!!!");
        let user=await collection.findOne({username:details.username})
        console.log(user.username);
        msg=user.username

        req.session.admin=details.username

        
        res.redirect('/admin')
  }).catch((status)=>{
      
      if(status.username==false){
        msg="entered username is incorrect"
        res.redirect('/admin/login')
        
      }
      else if(status.password==false){
        msg="entered password is incorrect"
        res.redirect('/admin/login')

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
        if(details.password==user.password){

            status.password=true
         resolve(details)
        }
     
      
    }
    reject(status)

  })
  
}

//edit user

router.get('/edituser/:id',async(req,res)=>{
    if(req.session.admin){
    let id=req.params.id
    let user=await usercollection.findOne({_id:id})
    console.log(user);
    res.render('edituser',{name:user.name,phone:user.phone,username:user.username,_id:user._id})
    }

    else{

        
        res.redirect('/admin/login')
        
    }
    
})
router.post('/edituser/:id',async(req,res)=>{
    var data=req.body
    let id=req.params.id
    console.log(id);
    await usercollection.updateOne({_id:id},{$set:{phone:data.phone,name:data.name}}) 
    res.redirect('/admin')
    
})

//delete user

router.get('/deleteuser/:id',async(req,res)=>{
    let id=req.params.id
    await usercollection.deleteOne({_id:id})
    
    res.redirect('/admin')
})

//create new user

router.get('/createuser',(req,res)=>{

    if(req.session.admin){
       
        res.render('createuser')
    }
   else{
     res.redirect('/admin/login') 
   }
})

router.post('/createuser',(req,res)=>{
    
  const data1={
    name:req.body.name,
    username:req.body.username,
    
    phone:req.body.phone,
    password:req.body.password,
  }
  console.log(data1);
   async function check(){
    let user1=await usercollection.findOne({username:data1.username})
    console.log(user1);
    if(user1==null){
        data1.password=await bcrypt.hash(data1.password,10)
        await usercollection.insertMany([data1])
        res.redirect('/admin')
     console.log("gate 1");
    }
    else{
        msg='username is already exist'
        res.redirect('/admin/createuser')
        
    }
}
check()
})

//logout

router.get('/logout',(req,res)=>{

    req.session.admin=null
    res.redirect('/admin/login')
  
  })
  
module.exports = router;