# 🖊️ Collaborative Whiteboard App

A real-time collaborative whiteboard application built using the **MERN stack** and **Socket.IO**, where multiple users can draw, view live cursors, and sync drawings across rooms.

## 🚀 Features

- ✍️ Real-time drawing and syncing
- 🧑‍🤝‍🧑 Multiple users per room
- 🎯 Live user cursors with unique colors
- ♻️ Replay old drawings when users rejoin
- 🧼 Clear canvas option
- 🏷️ Room-based sessions (create/join via code)

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB (Mongoose)
- **State Sync**: In-memory + DB

## 📦 Folder Structure

whiteboard-app/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ │ ├── DrawingCanvas.js
│ │ ├── Toolbar.js
│ │ ├── UserCursors.js
│ │ └── RoomJoin.js
│ └── App.js
├── server/ # Express backend
│ ├── server.js
│ └── models/ (optional)
├── .gitignore
└── README.md


