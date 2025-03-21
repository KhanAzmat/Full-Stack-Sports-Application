const { promisify } = require("util");
const User = require("../models/userModel")
const ApiKey = require("../models/apikeyModel")
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlerFactory");
const dbconnect = require("../models/dbconnect")
const rlm = require("realm")


exports.createApiKey = catchAsync(async (req, res, next) => {
    const projectName = req.body.projectName;
    console.log(req.body)
  
    try {
      
    const user = await ApiKey.findOne({ projectName });
    if(user) {
      res.status(409).json("Api Key for project alrady exists");
    } else {
      const r = (Math.random() + 1).toString(36).substring(2)
      const apiKey = uuidv4() +"-"+ r
      const key = await ApiKey.create({
        projectName: req.body.projectName,
        key: apiKey
      });
      
      const payload = {
        key: apiKey
      };
      
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {noTimestamp:true},
        (err, token) => {
          if (err) throw err;
          console.log()
          res.status(200).json({ token });
        }
      );
   
    }
  
     
    } catch (err) {
      res.status(500).json(err);
    }
  
    
  });


//This method verifies api key
 //This method validates mqtt username 
exports.verifyKey= catchAsync(async function (req, res, next) {
    //console.log("ip address",req.ip ,req.connection.remoteAddress)
    console.log(req.body)
    const token = req.body.password
    //console.log(req)
    const realm = await dbconnect.getDBPointer()
   try
   {
    if (!token) {
     res.status(200).send("deny")
     return
    }
    //2. Verification of the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    //3. Check if user still exists

    if(decoded.user){
    

  //onsole.log(rlm.BSON.ObjectID(decoded.user.id))
  const cUser = await realm.objectForPrimaryKey(User.name, rlm.BSON.ObjectID(decoded.user.id))//User.findById(decoded.user.id);
  //console.log(currentUser.toJSON())
  
 const  currentUser=cUser?cUser.toJSON():null
  
    if (currentUser) {
      res.status(200).send("allow")
    }
    else{
     res.status(200).send("deny")
    }
    }
    /*else if(decoded.key)   
    {
         const currentKey = await ApiKey.findOne({key : decoded.key})
         console.log(currentKey)
         if (currentKey) {
            res.status(200).send("allow")
          }
          else{
           res.status(200).send("deny")
          }

    }*/
  }
  catch(err)
  {
    console.log(err)
    res.status(200).send("deny")
  }
  });


  exports.deactivateKey = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.key.id, { active: false });
  
    res.status(204).json({
      status: "success",
      data: null,
    });
  });


exports.deleteKey= factory.deleteOne(ApiKey);
//exports.getAll = factory.getAllWithProjection(ApiKey,"-key")

  




  
