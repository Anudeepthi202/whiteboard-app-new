import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const socket = io('http://localhost:5000'); // Backend server

function Whiteboard() {
  const { roomId } = useParams();
  const [cursors, setCursors] = useState({});
  const [userCount, setUserCount] = useState(1); // Track connected users

  useEffect(() => {
    // Join the room
    socket.emit('join-room', { roomId });

    // Send own cursor position
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      socket.emit('cursor-move', { roomId, cursor: { x, y } });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Receive other users' cursor positions
    socket.on('cursor-update', ({ id, cursor }) => {
      setCursors((prev) => ({ ...prev, [id]: cursor }));
    });

    // Remove cursor on disconnect
    socket.on('user-left', (id) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    // Listen for real-time user count
    socket.on('user-count', (count) => {
      setUserCount(count);
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('cursor-update');
      socket.off('user-left');
      socket.off('user-count');
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#fff' }}>
      {/* Display user count */}
      <p style={{
        position: 'absolute',
        top: 10,
        right: 20,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#555',
        zIndex: 10
      }}>
        👥 {userCount} user{userCount !== 1 ? 's' : ''} online
      </p>

      <Toolbar socket={socket} roomId={roomId} />
      <DrawingCanvas socket={socket} roomId={roomId} />
      <UserCursors cursors={cursors} />
    </div>
  );
}

export default Whiteboard;
