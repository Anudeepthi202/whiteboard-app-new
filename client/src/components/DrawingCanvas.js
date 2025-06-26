import React, { useRef, useEffect } from 'react';

function DrawingCanvas({ socket, roomId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);

  const color = localStorage.getItem('drawColor') || 'black';
  const lineWidth = parseInt(localStorage.getItem('lineWidth')) || 3;

  // Initialize canvas once
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cursor = 'crosshair';

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  // Mouse events
  const startDrawing = ({ nativeEvent }) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = nativeEvent;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);

    socket.emit('draw-start', { roomId, offsetX, offsetY, color, lineWidth });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = nativeEvent;

    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    socket.emit('draw-move', { roomId, offsetX, offsetY, color, lineWidth });
  };

  const endDrawing = () => {
    isDrawing.current = false;
    ctxRef.current.closePath();
    socket.emit('draw-end', { roomId });
  };

  // Join room and load past drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    ctxRef.current = context;

    // Join room
    socket.emit('join-room', { roomId });

    // Replay past drawing from DB
    socket.on('load-drawing', (drawingData) => {
      drawingData.forEach((command) => {
        const { type, data } = command;

        if (type === 'start') {
          ctxRef.current.beginPath();
          ctxRef.current.moveTo(data.offsetX, data.offsetY);
          ctxRef.current.strokeStyle = data.color;
          ctxRef.current.lineWidth = data.lineWidth;
        } else if (type === 'move') {
          ctxRef.current.lineTo(data.offsetX, data.offsetY);
          ctxRef.current.stroke();
        } else if (type === 'end') {
          ctxRef.current.closePath();
        } else if (type === 'clear') {
          ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    });

    // Listen for live drawing from others
    socket.on('draw-start', (data) => {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(data.offsetX, data.offsetY);
      ctxRef.current.strokeStyle = data.color;
      ctxRef.current.lineWidth = data.lineWidth;
    });

    socket.on('draw-move', (data) => {
      ctxRef.current.lineTo(data.offsetX, data.offsetY);
      ctxRef.current.stroke();
    });

    socket.on('draw-end', () => {
      ctxRef.current.closePath();
    });

    socket.on('clear-canvas', () => {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('load-drawing');
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
    };
  }, [roomId, color, lineWidth, socket]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    />
  );
}

export default DrawingCanvas;
