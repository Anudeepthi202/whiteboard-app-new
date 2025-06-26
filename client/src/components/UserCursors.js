import React, { useEffect, useRef, useState } from 'react';

function UserCursors({ socket, roomId }) {
  const [cursors, setCursors] = useState({});
  const userColor = useRef(getRandomColor());

  // ✅ Send your mouse position to others
  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      socket.emit('cursor-move', {
        roomId,
        cursor: { x: clientX, y: clientY, color: userColor.current }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [socket, roomId]);

  // ✅ Receive others' cursor updates
  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = ({ id, cursor }) => {
      setCursors(prev => ({
        ...prev,
        [id]: { ...cursor, timestamp: Date.now() }
      }));
    };

    socket.on('cursor-update', handleCursorUpdate);
    return () => socket.off('cursor-update', handleCursorUpdate);
  }, [socket]);

  // ✅ Clean up inactive cursors (older than 5 sec)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors(prev =>
        Object.fromEntries(
          Object.entries(prev).filter(([_, c]) => now - c.timestamp < 5000)
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y, color }]) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top: y,
            left: x,
            width: 12,
            height: 12,
            backgroundColor: color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

// Generate a unique color for each user
function getRandomColor() {
  const colors = ['orange', 'purple', 'blue', 'green', 'pink', 'teal'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default UserCursors;
