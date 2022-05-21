const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser: true, 


}).then(()=>{
    console.log(`connection successful`);
}).catch((err)=>console.log("fail to connect"));
var conn = mongoose.Collection;

var uploadSchema = new mongoose.Schema({
    imagename: String,
    textcontent:String,
});

var uploadImgModel = mongoose.model('uploadImgFiles',uploadSchema);
module.exports=uploadImgModel;