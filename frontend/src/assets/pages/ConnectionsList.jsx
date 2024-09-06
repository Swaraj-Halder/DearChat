import axios from 'axios';
import React, { useState,useEffect } from 'react';

function ConnectionsList(){

  const [connections, setConnections] = useState([])

  useEffect(() => {
    (async() => {
      const response = await axios.get('http://localhost:8001/api/v1/user/connections', {
      headers:{
        'username': 'Node',            // Custom header
    'Content-Type': 'application/json'
      }
    });
    console.log(response.data.connectionList);

    setConnections(response.data.connectionList);
  })();

  }, [])

  return (
    <ul>
      {connections.map((connection) => (
        <li>{connection.userName}</li>
      ))}
    </ul>
  );
};

export default ConnectionsList;
