const mongoose=require('mongoose')


mongoose.set('strictQuery', false);
mongoose.createConnection("mongodb://127.0.0.1/signupdata", { useNewUrlParser: true });


const LogInSchema=new mongoose.Schema({
   


    username:{
        type:String,
    required:true},


    password:{
        type:String,
    required:true}
})


const collection=new mongoose.model("admindatas",LogInSchema)



module.exports=collection