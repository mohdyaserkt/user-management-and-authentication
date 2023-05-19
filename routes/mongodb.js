const mongoose=require('mongoose')


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/signupdata", { useNewUrlParser: true });


const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
    required:true},


    username:{
        type:String,
    required:true},


    password:{
        type:String,
    required:true},

    phone:{
        type:String,
    required:true}

    
})



const collection=new mongoose.model("collection1",LogInSchema)




module.exports=collection
