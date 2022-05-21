
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');//middleware for uploading images
const path = require('path')
const bodyParser = require('body-parser')
var fs = require('fs');
var filePath = './public/uploads'; 
//use bodyParser() if you want the form data to be available in req.body.
app.use(bodyParser.urlencoded({extended: true}));
  
const uploadImgModel = require('./modules/upload')//get model(collection) of db

app.use(express.static(path.join(__dirname, './public')))

app.set('view engine','ejs');

var storage = multer.diskStorage({
    destination:"public/uploads/",
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,file.filename + '-' + Date.now()+path.extname(file.originalname));
    }
})
const upload = multer({
    storage:storage
})

app.post('/upload',upload.single('file'),(req,res,next)=>{
    
    // if(!req.file)
    // return res.render("404");;
    const imageFile = req.file.filename;
    const textcontent = req.body.file;
    const imageInfo = new uploadImgModel({
        imagename:imageFile,
        textcontent:textcontent
    })
    imageInfo.save((err,doc)=>{
        if(err)throw err;
        uploadImgModel.find({},(err,data)=>{
            if(!err){
                // console.log('records',data);
                res.render('home',{records:data});
            }else throw err;
        }).clone().catch((err)=>console.log(err));
        
        // to clone the query and re-execute it.
    });
    
})
app.post('/display',upload.single('file'),(req,res)=>{
    const imageFile = req.file.filename;
    const textcontent = req.body.file;
    const imageInfo = new uploadImgModel({
        imagename:imageFile,
        textcontent:textcontent
    })
    imageInfo.save((err,doc)=>{
        if(err)throw err;
        uploadImgModel.find({},(err,data)=>{
            if(!err){
                // console.log('records',data);
                res.render('frontend',{records:data});
            }else throw err;
        }).clone().catch((err)=>console.log(err));
        
        // to clone the query and re-execute it.
    });
    
})
app.post('/deleteImg',upload.single('file'),(req,res)=>{
    // console.log(req.file);
    console.log(req.body.uploadimg[1]);
    var imgid = req.body.uploadimg[1];
    // console.log(imgid)
    const path1  = path.join(filePath,imgid);
    // console.log(path1)
    fs.unlinkSync(path1);
    uploadImgModel.deleteOne({imagename:imgid},(err,data)=>{
        if(!err){
            res.redirect('/display')
        }else throw err;
    })
    
})

app.get('/upload',(req,res)=>{
    
    uploadImgModel.find({},(err,data)=>{
        if(!err){
            res.render('home',{records:data});
        }else throw err;
    }).clone().catch((err)=>console.log(err));
    
})
app.get('/display',(req,res)=>{
    
    uploadImgModel.find({},(err,data)=>{
        if(!err){
            res.render('frontend',{records:data});
        }else throw err;
    }).clone().catch((err)=>console.log(err));
    
})

app.post('/editImg',upload.single('file'),(req,res,next)=>{
    console.log(req.file);
    console.log(req.body);
    console.log(req.file.filename);
    // const filenename = req.body.file2.filename + '-' + Date.now()+path.extname(req.body.file2);
      
    
    var imgid2 = req.body.uploadimg[1];
    // console.log(imgid)
    const path2  = path.join(filePath,imgid2);
    // console.log(path1)
    fs.unlinkSync(path2);
    
    // const textnew = req.body.file;
    // console.log(req.body);
    // console.log(filenename);
    res.redirect('/display')
    uploadImgModel.updateOne({imagename:req.body.uploadimg},{
        $set:{
            imagename:req.file.filename,
            textcontent:req.body.file,
        }
    },(err,data)=>{
        if(!err){
            res.render('home',{records:data});
        }else throw err;
    }).clone().catch((err)=>console.log(err));
    
})

app.listen(port,()=>{
    console.log(`Listening to http://localhost:${port}/upload`);
})


