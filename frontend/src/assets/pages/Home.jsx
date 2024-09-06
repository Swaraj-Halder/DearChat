import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import SearchBar from './Search.jsx';

const socket = io('http://localhost:8001');

const ChatHomePage = () => {
  const [connections, setConnections] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(''); // Assume userId is fetched from auth or context

  useEffect(() => {
    // Fetch initial connections using Axios
    axios.get(`http://localhost:8001/api/v1/user/connections`, {
        headers:{
            'username': 'Node',            // Custom header
        'Content-Type': 'application/json'
          }
    })
    .then(response => {
      setConnections(response.data.connectionList);
    })
    .catch(error => {
      console.error("There was an error fetching the connections!", error);
    });

    // Listen for new messages and update connections
    socket.on('message', () => {
      axios.get(`http://localhost:8001/api/v1/user/connections`, {
        headers:{
            'username': 'Node',            // Custom header
        'Content-Type': 'application/json'
          }
      })
      .then(response => {
        setConnections(response.data.connectionList);
      })
      .catch(error => {
        console.error("There was an error updating the connections!", error);
      });
    });
  }, []);

  const handleSearch = (query) => {
    if (query) {
      axios.get(`http://localhost:8001/api/v1/user/search`, {
        params: { query },
        headers:{
            'username': 'Node',            // Custom header
        'Content-Type': 'application/json'
          }
      })
      .then(response => {
        console.log(response.data.result);
        
        setSearchResults(response.data.result);
      })
      .catch(error => {
        console.error("There was an error fetching the search results!", error);
      });
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <h1>Your Connections</h1>
      <SearchBar onSearch={handleSearch} />
      
      <ul>
        {searchResults.connectedUsers?.length > 0 ? (
          <div>
            <h3>Connected Users</h3>
            {searchResults.connectedUsers.map(user => (
              <li key={user._id}>{user.username}</li>
            ))}
          </div>
        ) : (
          connections.map(connection => (
            <li key={connection._id}>{connection.username}</li>
          ))
        )}
      </ul>

      {searchResults.allUsers?.length > 0 && (
        <div>
          <h3>All Users</h3>
          <ul>
            {searchResults.allUsers.map(user => (
              <li>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatHomePage;
