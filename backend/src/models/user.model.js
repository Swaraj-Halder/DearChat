import mongoose, {Schema} from "mongoose"

// import { sendOtpEmail, generateOTP, checkOTP } from "../constants.js";

const userSchema = new Schema({
    Name:{
        type: String
    },
    userName:{
        type: String,
        required:[true, "userName is required"],
        unique:[true, "This userName is already exist "]
    },
    email:{
        type:String,
        required:[true, "email is required...."],
        unique:[true, "This email is already exist "]
    },
    avtar:{
        type:String
    },
    connections:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendingConnections:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
    connectionReqests:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
    chatRooms: [{
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom'
    }]
},
{timestamps:true});


const User = mongoose.model("User",userSchema)
export{User}