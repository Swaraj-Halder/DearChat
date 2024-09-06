import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// const socket = io('http://localhost:8001'); // Replace with your server's URL

const socket = io('http://localhost:8001', {
  transports: ["websocket"], // Use WebSocket transport
  autoConnect: false, // Prevent auto connection on import
});

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(["Hello"]);


  useEffect(() => {
    // Connect to the server when the component mounts
    socket.connect();

    // Listen for incoming messages from the server
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the effect
    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []);


  const sendMessage = () => {
    if (message.trim()) {
      // Emit the message to the server
      const ok = socket.emit('message', message);
      console.log(ok);

      // setMessages((prevMessages) => [...prevMessages, message])
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            {msg}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Type your message here..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80vh',
    padding: '20px',
    backgroundColor: '#000',
  },
  chatWindow: {
    width: '100%',
    height: '80vh',
    overflowY: 'scroll',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  message: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    color: "black"
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default ChatInterface;
