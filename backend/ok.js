const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 6-digit OTP
  };

  // Example usage
  const otp = generateOtp();
  console.log('Generated OTP:', otp);