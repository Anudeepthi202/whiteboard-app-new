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
## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Anudeepthi202/whiteboard-app-new.git
cd whiteboard-app-new
Install dependencies
Server
bash
Copy
Edit
cd server
npm install
Client
bash
Copy
Edit
cd ../client
npm install

PORT=5000
MONGO_URI=mongodb://localhost:27017/whiteboardDB
Use your actual MongoDB connection string (Atlas or local)

4. Run the app locally
# Terminal 1
cd server
node server.js

# Terminal 2
cd client
npm start
Visit: http://localhost:3000


🔌 API Documentation
🔄 Socket Events
Event Name	Payload	Description
join-room	{ roomId }	Join a specific whiteboard room
draw-start	{ offsetX, offsetY, color }	Begin drawing path
draw-move	{ offsetX, offsetY, color }	Draw line to position
draw-end	{}	End drawing path
clear-canvas	{ roomId }	Clear the canvas for all users
cursor-move	{ x, y, color }	Update user cursor location
load-drawing	Array of draw actions	Load stored drawing on user join

REST API is minimal since this app is mostly socket-based.

🧠 Architecture Overview
Frontend: React with basic context/state

Backend: Node.js + Express + Socket.IO

Database: MongoDB for storing drawing history

Communication: WebSockets for real-time drawing and cursor sharing

🚀 Deployment Guide
If deploying to Vercel + Render or Netlify + Render:

Frontend (Client)

Push the client folder to a Git repo

Deploy using Vercel or Netlify

Set the build command: npm run build

Publish directory: build

Backend (Server)

Push the server folder to another repo or backend folder

Deploy on Render.com

Add a web service

Start command: node server.js

Set the port to 5000 (or as used in the code)



