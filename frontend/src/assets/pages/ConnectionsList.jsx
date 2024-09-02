import axios from 'axios';
import React, { useState,useEffect } from 'react';

function ConnectionsList(){

  const [connections, setConnections] = useState([])

  useEffect(() => {
    (async() => {
      const responce = await axios.get('http://localhost:8001/api/v1/user/connections', {
      headers:{
        'username': 'Node',            // Custom header
    'Content-Type': 'application/json'
      }
    });
    console.log(responce.data.connectionList);

    setConnections(responce.data.connectionList);
  })();

  }, [])

  return (
    <ul>
      {connections.map((connection, index) => (
        <li key={index}>{connection}</li>
      ))}
    </ul>
  );
};

export default ConnectionsList;
