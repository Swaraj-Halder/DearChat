import {User} from "../models/user.model.js"
import {ChatRoom} from "../models/cahtRoom.model.js"
import {generateOTP, sendOtpEmail, saveOTP, verifyOTP} from "../constants.js";
import jwt from "jsonwebtoken"



const getOtpForSignup = async (req, res) => {
    const {email, userName}= req.body;
    if(!email || !userName){
      return res.status(400).json({message: "Email is required"})
    }
    try {
      const user = await User.findOne({ email });
      if(user){
        return res.status(302).json({message:"user already exist with this email!!"})
      }


    const otp = generateOTP();
    if(!otp){
      return res.status(500).json({message:"problem in generating otp"})
    }

    saveOTP(userName, otp)

    const otpSend = sendOtpEmail(email, otp)


      if(!otpSend) return res.status(503).json({message:"some problem occured during sending otp"})

      return res.status(201).json({message:"OTP send successfully for signup"});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  const signup = async(req, res) => {
    const {Name, userName, email} = req.body;
    const userOtp = req.body.otp;

    if(!Name || !userName || !email || !userOtp){
      return res.status(400).json({message:"Name, userName, email and otp is required !!"})
    }

    const usedUserName = await User.findOne({userName})

    if(usedUserName){
      return res.status(401).json({message:"UserName already exist"})
  }

    try {
      const matchOTP = verifyOTP(userName,userOtp)

      if(!matchOTP){
          return res.status(400).json({message:"invalid otp"})
      }
      const user = await User.create({
          Name,
          userName,
          email,
      })

      if(!user){
        return res.status(405).json({message:"unable to create user"})
      }

      return res.status(201).json(user)
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const getOtpForLogin = async(req, res) => {
  const{userName, email} = req.body
  console.log(userName, email)

  if (!userName || !email) {
    return res.status(401).json({message:"userName and email is required"})
  }
  try {
    const user = await User.findOne({userName})
    if(!user){
      return res.status(404).json({message:"user not found || user sould singedup first"})
    }

  const otp = generateOTP();


  if(!otp){
    return res.status(500).json({message:"problem in generating otp"})
  }
  saveOTP(userName,otp)
  const otpSend = sendOtpEmail(email, otp)

  if(!otpSend){
    return res.status(500).json({message:"problem in sending otp"})
  }

  return res.status(200).json({message:"OTP send successfully for login", success: true});
  } catch (error) {
    return res.status(306).json({error})
  }
}

const login = async(req, res) => {
  const {userName, email} = req.body;
  const userOtp = req.body.otp;

  if(!userOtp || !userName || !email){
    return res .status(401).json({message:"otp, userName and email is required"})
  }

  const otpMatched = verifyOTP(userName, userOtp)
console.log(otpMatched,userOtp);

  if(!otpMatched){
    return res.status(400).json({message:"Invalid OTP"})
  }

  try {
    const user = await User.findOne({userName})

    if(!user){
      return res.status(404).json({message:"user not found"})
    }


    return res.status(200).json({user, success:true})

  } catch (error) {
    return res.json({error})
  }
}

const sendConnectionRequest = async(req, res) => {

  const senderUserName = req.headers.username
  if(!senderUserName){
    return res.status(401).json({message:"Please login first"})
  }
  const receiverUserName = req.body.userName
  if(!receiverUserName){
    return res.status(405).json({message:"Please submit a reciver userName or user must be not availabe on our platform at this moment"})
  }
  try {
    const sender = await User.findOne({userName:senderUserName})
    const receiver = await User.findOne({userName:receiverUserName})

    if(!sender || !receiver){
      return res.status(404).json({message:"can't find you and your suggested connection users must signedup and logedin"})
    }
    const isAlreadyConnected = sender.connections?.includes(receiver._id)

        if (isAlreadyConnected) {
            return res.status(407).json({ message: 'You are already connected with this user.' }) ;
        }

         // Add receiver to peding connections
        sender.pendingConnections.push(receiver._id);
         // Add sender to connection requestes
        receiver.connectionReqests.push(sender._id);

         // Save both users
        await sender.save();
        await receiver.save();

        return res.status(200).json({ message: 'successfully send the connection request' });
  } catch (error) {
      return res.status(304).jason(error)
  }

}

const acceptConnectionRequest = async(req, res) => {
  const senderUserName = req.body.userName
  const receiverUserName = req.headers.username

  if(!senderUserName || !receiverUserName){
    return res.status(405).json({message:"Please submit a reciver userName and sender userName"})
  }
  try{
    const sender = await User.findOne({userName:senderUserName})
  const receiver = await User.findOne({userName:receiverUserName})
  if(!sender){
    return res.status(404).json({message:"The sender may not vailable at this moment at our site"})
  }
  if(!receiver){
    return res.status(404).json({message:"could not find the user, user must signedup "})
  }

  const isAlreadyConnected = sender.connections?.includes(receiver._id)
  if (isAlreadyConnected) {
    return res.status(400).json({ message: 'You are already connected with this user.' }) ;
}
   // Add receiver to connections
  sender.connections.push(receiver._id);
   // Add sender to connections
  receiver.connections.push(sender._id);

  
  
  // remove receiver from pending connection
  const senderIndex = sender.pendingConnections.indexOf(receiver._id);
  if (senderIndex < 0) {
    return res.status(404).json({message:"receiver is not found in senders pending connection"})
  }
  sender.pendingConnections.splice(senderIndex, 1);
  
  
  // remove sender from connection requestes
  const receiverIndex = receiver.connectionReqests.indexOf(sender._id);
  if (receiverIndex < 0) {
    return res.status(404).json({message:"sender is not found in your connection requests"})
  }
  receiver.connectionReqests.splice(receiverIndex, 1);
  
  const newCahtRoom = await ChatRoom.create({
    name:senderUserName+receiverUserName,
    members:[
      sender._id,
      receiver._id
    ],
    createdBy:[
      sender._id,
      receiver._id
    ]
  })
  if(!newCahtRoom) {
    return res.status(506).json({message:"problemcreating chatRoom"})
  }
  sender.chatRooms.push(newCahtRoom._id)
  receiver.chatRooms.push(newCahtRoom._id)


  await sender.save()
  await receiver.save()

  return res.status(200).json({sender,receiver})
  }catch(error){
    return res.status(500).json({message:error.message})
  }


}

const declineConnectionRequest = async(req, res) => {
  const senderUserName = req.body.userName
  const receiverUserName = req.headers.username

  if(!senderUserName || !receiverUserName){
    return res.status(405).json({message:"Please submit a reciver userName and sender userName"})
  }
  try{
    const sender = await User.findOne({userName:senderUserName})
    const receiver = await User.findOne({userName:receiverUserName})
    if(!sender){
      return res.status(404).json({message:"The sender may not vailable at this moment at our site"})
    }
    if(!receiver){
      return res.status(404).json({message:"could not find the user, user must signedup "})
    }



    // remove receiver from pending connection
    const senderIndex = sender.pendingConnections.indexOf(receiver._id);
    if (senderIndex < 0) {
      return res.status(404).json({message:"receiver is not found in senders pending connection"})
    }
    sender.pendingConnections.splice(senderIndex, 1);
    
    
    // remove sender from connection requestes
    const receiverIndex = receiver.connectionReqests.indexOf(sender._id);
    if (receiverIndex < 0) {
      return res.status(404).json({message:"sender is not found in your connection requests"})
    }
    receiver.connectionReqests.splice(receiverIndex, 1);



    await sender.save()
    await receiver.save()

    return res.status(200).json({sender,receiver})

  }catch(error){
    return res.status(500).json({message:error.message})
  }



}



const getConnections = async(req, res) => {

  try {

    const userName = req.headers.username;
    if(!userName){
      return res.status(402).json({message:"userName is required"})
    }
    const user = await User.findOne({userName:userName});
    if(!user){
      return res.status(404).json({message:"no user is found user sould be signedup"})
    }
    const id = user.connections[0]

    if(user.connections.length == 0){
      return res.status(301).json({message:"user is not connected to any one at this moment"})
    }
    let connectionList = []


    user.connections.map(async (id) => {
      // const connection = (async function(){return await User.findById(Id);})()
      // const connection = (async function(){
      //   return await User.findById(id);
      // })()
      const connection = await User.findById(id);

      console.log(connection);
      connectionList.push(connection);
      // return connection
    })


    
      // const connectionList = await User.findById(id);
      console.log(connectionList);
      
      if(connectionList.length == 0){
        return res.status(301).json({message:"user is not connected to any one at this moment"})
      }

    return res.status(200).json({connectionList})


  } catch (error) {
    return res.status(400).json({error:error.message})
  }
}


// import {Server} from "socket.io"

// const io = new Server();

// const socket = () => {
//   io.on("connection", (socket) => {
//     console.log('A user connected:', socket.id);
//     socket.on("message", (message) => {
//         io.emit("message", message)
//     })
// })}






  export {
    getOtpForSignup,
    signup,
    getOtpForLogin,
    login,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    getConnections,
    // socket
  }