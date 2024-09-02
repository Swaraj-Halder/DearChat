import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8001/api/v1/user/get-otp-for-signup', { email, userName });
      if (response.data.success) {
        setOtpSent(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(response.data.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8001/api/v1/user/signup', { name, userName, email, otp });
      if (response.data.success) {
        setMessage('Signup successful');
        // Redirect to login or another page
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to verify OTP');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <input
        type="name"
        placeholder="Enter your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="userName"
        placeholder="Enter your userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      {!otpSent?(<button onClick={sendOtp} style={styles.button} disabled={otpSent}>
        Send OTP
      </button>) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <button onClick={verifyOtp} style={styles.button}>
            Verify OTP
          </button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '200px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    margin: '10px 0',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Signup;