import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function RoomJoin() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // JOIN ROOM
  const handleJoin = async () => {
  const code = roomCode.trim();
  if (code.length < 6 || code.length > 8) {
    alert('Room code must be 6 to 8 characters.');
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/rooms/join`, {
      roomId: code,
    });

    if (response.data.success) {
      navigate(`/room/${code}`);
    } else {
      alert('Unable to join room.');
    }
  } catch (err) {
    console.error('Join error:', err);
    alert('Server error. Try again.');
  }
};

  // CREATE ROOM
  const handleCreate = async () => {
    const newRoom = uuidv4().slice(0, 8); // 8-char code

    try {
      const response = await axios.post('http://localhost:5000/api/rooms/join', {
        roomId: newRoom,
      });

      if (response.data.success) {
        navigate(`/room/${newRoom}`);
      } else {
        alert('Room creation failed.');
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Server error. Try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '150px' }}>
      <h1>Collaborative Whiteboard</h1>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        style={{ padding: '10px', width: '220px' }}
      />
      <br /><br />
      <button onClick={handleJoin} style={{ padding: '10px 20px', marginRight: '10px' }}>
        Join Room
      </button>
      <button onClick={handleCreate} style={{ padding: '10px 20px' }}>
        Create New Room
      </button>
    </div>
  );
}

export default RoomJoin;
