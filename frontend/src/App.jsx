import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './assets/pages/signup';
import Login from './assets/pages/login';
import ChatInterface from './assets/pages/ChatRoom.jsx';
import ConnectionsList from './assets/pages/ConnectionsList.jsx';

function App() {

  return (
    <Router>
      <div style={styles.navbar}>
        <Link to="/signup" style={styles.link}>Signup</Link>
        <Link to="/login" style={styles.link}>Login</Link>
      </div>
      <Routes>
        <Route path="/" element={<ConnectionsList/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  )
}


const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#007bff',
  },
  link: {
    margin: '0 15px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default App
