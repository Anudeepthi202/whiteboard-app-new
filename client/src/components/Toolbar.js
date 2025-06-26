import React, { useState } from 'react';

const colors = ['black', 'red', 'blue', 'green'];

function Toolbar({ socket, roomId }) {
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(3);

  // Emit clear-canvas to all users
  const handleClear = () => {
    socket.emit('clear-canvas', { roomId });
  };

  // Broadcast color + width updates (optional if needed elsewhere)
  // For now, we’ll store in localStorage so DrawingCanvas can read them
  const handleColorChange = (newColor) => {
    setColor(newColor);
    localStorage.setItem('drawColor', newColor);
  };

  const handleLineWidthChange = (e) => {
    const width = parseInt(e.target.value);
    setLineWidth(width);
    localStorage.setItem('lineWidth', width);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 1,
      background: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div>
        <strong>Color:</strong><br />
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => handleColorChange(c)}
            style={{
              backgroundColor: c,
              border: color === c ? '2px solid black' : '1px solid gray',
              width: 24,
              height: 24,
              margin: 2,
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Stroke Width:</strong><br />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={handleLineWidthChange}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleClear}>🧹 Clear Canvas</button>
      </div>
    </div>
  );
}

export default Toolbar;
