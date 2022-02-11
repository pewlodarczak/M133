const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username:String,
    phone:Number,
    password:String,
    userType: {
        type: String,
        enum : ['user','admin'],
        default: 'user'
    },
}) ;
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);