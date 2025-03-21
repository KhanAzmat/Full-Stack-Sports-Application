const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const fs = require('fs')
const dbconnect = require("./../models/dbconnect")
const rlm = require("realm");
const { response } = require("express");
const nodemailer =require("nodemailer")
const {google} = require("googleapis")
const {OAuth2} = google.auth.OAuth2

///Check whether any user exits
//





exports.checkUserDocument = catchAsync(async (req, res, next) => {
  //const { email } = req.body;
console.log("Body",req.body)
const realm =await dbconnect.getDBPointer()
  try {
  console.log(realm)    
  const count = await realm.objects(User.name).length
  console.log("User count",count)
  if(count) {
    res.status(200).json({count});
  } else {
   


    res.status(200).json({count});
  }

   
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
 dbconnect.disconnect()
  next();
});



/// First time Sign up admin password settings ///
exports.signupFirst = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const realm = await dbconnect.getDBPointer() 
  try {
    
  const count= await realm.objects(User.name).length;
  if(count > 0) {
    res.status(401).json("Unauthorized");
  } else {

  
  console.log(Date())   
   const usr = {
    _id:rlm.BSON.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: await User.encryptPassword(req.body.password),
    passwordConfirm: "",
    role: "admin",
    //company: "",
   }
       


    /*const USER = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.confirmPassword,
      role: "admin",
      company: "",
    });
     */

   let USER
   await realm.write(()=>{
    
        USER = realm.create(User.name,usr)
     

    })
    const payload = {
      user: {
        id: USER._id.toString(),
      },
    };


    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {noTimestamp:true},
      (err, token) => {
        if (err) throw err;
        console.log("Token created successfully")
        //res.status(200).json({ token });
        jsonString = JSON.stringify({token})
        fs.writeFile("./key.json",jsonString,(err)=>{
          if(err)
          {
            console.log("RTLS:Cant store file",err)
          }
          else{
            console.log("RTLS:Key stored successfully")
          }
        })
      }
    )


    res.json({ USER });
  }

   
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }

  next();
});







////Sign up new user


exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const realm = await dbconnect.getDBPointer()

  try {
    
  //const user = await User.findOne({ email }).select("+password");
  const user =  await realm.objects(User.name).filtered("email==$0", req.body.email);
  if(user) {
    res.status(401).json("This user already exists!");
  } else {
    
    if(req.body.password !== req.body.passwordConfirm)
  {
    return next(new AppError("Password and confirm password dosnt match", 400));
  }
  const newPassword = await User.encryptPassword(req.body.password)
    
    let USER
    realm.write(()=>{ 

       USER =realm.create(User.name,{
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        passwordConfirm: undefined,
        role: req.body.role,
        company: req.body.company,
       })
    })
    
   
   


    res.json({ USER });
  }

   
  } catch (err) {
    res.status(500).json(err);
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    //1. Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    console.log(email)
    //2. check if user exist and password is correct
    const realm  = await dbconnect.getDBPointer()
    const userdata = await realm.objects(User.name).filtered("email LIKE $0", email);
    //const user1 = userdata[0]
    const user=userdata[0].toJSON()
    if (!user || !(await User.correctPassword(password, user.password))) {
      res.status(401).json("Invalid email or password");
    }

    //3. if everything is ok, send token to client

    const payload = {
      user: {
        id: user._id.toString(),
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    return next(new AppError(err.message, 500));
  }
});


//This method validates mqtt username 
exports.mqttAuth = catchAsync(async function (req, res, next) {
  console.log("ip address",req.ip ,req.connection.remoteAddress)
  console.log(req.body)
  const token = req.body.username
  //console.log(req)

  if (!token) {
   res.status(200).send("deny")
  }
  //2. Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exists
  const currentUser = await User.findById(decoded.user.id);

  if (currentUser) {
    res.status(200).send("allow")
  }
  else{
   res.status(200).send("deny")
  }
});



exports.protect = catchAsync(async function (req, res, next) {
  const token = req.header("Authorization");

  const realm = await dbconnect.getDBPointer()
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }
  //2. Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exists
  //onsole.log(rlm.BSON.ObjectID(decoded.user.id))
  const cUser = await realm.objectForPrimaryKey(User.name, rlm.BSON.ObjectID(decoded.user.id))//User.findById(decoded.user.id);
  //console.log(currentUser.toJSON())
 
  if (!cUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }



 const  currentUser=cUser.toJSON()
 
 if(currentUser){
  currentUser.id = currentUser._id.toString()
 } 
 //console.log(currentUser)

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
 ///TODO
  //4. Check if user changed passwords after the token was issued
  if (User.changedPasswordAfter(currentUser,decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(400).json("You do not have permission to perform this action")
      );
    }

    next();
  };
};



const createTransporter = async () => {




  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
  },
  tls: {
    rejectUnauthorized: false
  }

  });

  return transporter;
 
}




exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on posted email
  //const user = await User.findOne({ email: req.body.email });
  const realm = await dbconnect.getDBPointer()
  const userData =  await realm.objects(User.name).filtered("email == $0", req.body.email);
  //const user = await 
  if (!(userData.length > 0)) {
    res.status(400).json({message:"Email dons't exists . "})
    return
  }

  const user = userData[0]
  //2. Generate random token
  const tokenInfo = await User.createPasswordResetToken();
  const resetToken = tokenInfo[1]
  //await user.save({ validateBeforeSave: false });
  console.log(tokenInfo[2].valueOf())
  await realm.write(()=>{
      const d1 = new Date(tokenInfo[2])
      user.passwordResetToken = tokenInfo[0]
      user.passwordResetExpires = d1
  })

 // manage proxy here
  //3. send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetPassword/${resetToken}}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forgot your password, please ignore this email.`;

  try {
    
    

    const sendEmail = async (emailOptions) => {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions);
    };
    
    await sendEmail({
      
      subject: "Your password reset token (valid for 10 min)",
      text:message,
      to: user.email,
      from: process.env.EMAIL
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    //user.passwordResetToken = undefined;
    //user.passwordResetExpires = undefined;
    console.log(err)
    await realm.write(()=>{
      user.passwordResetToken = ""
      user.passwordResetExpires = new Date()

  })

  res.status(500).json({message:"System error cant send email.Check Internet status"})
  return
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const realm = await dbconnect.getDBPointer()
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  /*const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });*/

  const userR  =  await realm.objects(User.name).filtered("passwordResetToken==$0 AND passwordResetExpires > $1",hashedToken, Date());
  const user=userR[0]
  
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if(req.body.password !== req.body.passwordConfirm)
  {
    return next(new AppError("Password and confirm password dosnt match", 400));
  }
  const newPassword = await User.encryptPassword(req.body.password)
  await realm.write(()=>{
  user.password = newPassword;
  user.passwordConfirm = undefined
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  })
  
  //await user.save();

  //3. Update changedPasswordAt property for the user

  //4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  //const user = await User.findById(req.user.id).select("+password");
  const realm = await dbconnect.getDBPointer() 
   const user =await  realm.objectForPrimaryKey(User.name, rlm.BSON.ObjectID(req.params.id));
   
   if(!user)
   {
    //return next(new AppError("User dosn't exists ", 400));
    res.status(400).json({message:"User dons't exists. "})
    return
   }
  // 2) Check if POSTed current password is correct
   else if (!(await User.correctPassword(req.body.passwordCurrent, user.password))) {
    //return next(new AppError("Your current password is wrong.", 400));
    res.status(401).json({message:"Wrong existing password."})
    return

  }

  // 3) If so, update password
  else if (req.body.password!==req.body.passwordConfirm)
  {
    //return next(new AppError("", 400));
    res.status(400).json({message:"New Password and  confirm password dosnt match."})
    return
  }
  
  const newPassword = await User.encryptPassword(req.body.password)
  await realm.write(()=>{
    user.password = newPassword;
    user.passwordConfirm = "";
  })
 
  //user.password = req.body.password;
  //user.passwordConfirm = req.body.passwordConfirm;
  //await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});
