import nodemailer from "nodemailer"
import dotenv from "dotenv"
import NodeCache from "node-cache"


dotenv.config({
    path: "./.env"
})

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email provider
  secure:true,
  port:465,
  auth: {
    user: process.env.EMAIL_ADDRESS, // Your email address
    pass: process.env.EMAIL_PASSWORD   // Your email password
  }
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Dear Chat" <${process.env.EMAIL_ADDRESS}>`, // Sender address
    to: to, // List of recipients
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}` // Plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false
  }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  };


  const otpCache = new NodeCache({ stdTTL: 3000 }); // TTL of 5 minutes
  // Save OTP
  const saveOTP = (userName, otp) => {
    otpCache.set(userName, otp);
  };

  // Verify OTP
  const verifyOTP = (userName, userOtp) => {
    const otp = otpCache.get(userName);
    console.log(otp);
    
    if (otp == userOtp) {
      otpCache.del(userName); // Free up storage after successful verification
      return true;
    }
    return false;
  };
// const checkOTP = function(otp, userOTP){
//     if(otp==userOTP){
//         return true;
//     } else{
//         return false;
//     }
// }

export{
    sendOtpEmail,
    generateOTP,
    saveOTP,
    verifyOTP
}