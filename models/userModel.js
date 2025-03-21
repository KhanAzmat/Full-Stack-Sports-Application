const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const realm = require("realm")


const UserSchema ={
  
    
    name:"user",
    properties: {

    _id:{type:"objectId"},  
    
    name: {
      type: "string",
      required: [true, "Please tell us your name!"],
    },

    email: {
      type: "string",
      lowercase: true,
    },
    role: {
      type: "string",
      enum: ["user", "admin"],
      default: "user",
    
    },
    password: {
      type: "string",
      
      select: false,
    },
    passwordConfirm: {
      type: "string",
      
    
    },

    passwordChangedAt: {type:"date", default: Date()},
    passwordResetToken: {type:"string?", default:""},
    passwordResetExpires: {type:"date?", default: Date()},
   
  },
 
 primaryKey:"_id",



/*userSchema.pre("save", async function (next) {
  //Only run this function is password was actually modified
  if (!this.isModified("password")) return next();
  //hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passworConfrim field
  this.passwordConfirm = undefined;
  next();
});*/

 encryptPassword : async function(password){
  const encPassword = await bcrypt.hash(password, 12)
  return encPassword

},


/*userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
*/
 correctPassword : async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
},

changedPasswordAfter : function (obj,JWTTimeStamp) {
  if (obj.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      obj.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // false means password not changed
  return false;
},


 createPasswordResetToken : async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");
  const passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  const passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  const temp1 = new Date(passwordResetExpires).toISOString().split(".")[0]
  
  //const temp = new Date(passwordResetExpires).oISOString()
  //const temp = new Date(temp1)

  return [passwordResetToken,  resetToken , temp1]
 }
};

module.exports = UserSchema //= mongoose.model("User", userSchema);
