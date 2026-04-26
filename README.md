# 📱 Task Manager App - Full Stack Mobile Application

A complete **Task Manager Application** with Role-Based Access Control built with React Native (Expo) and Node.js + Express + MongoDB.

## ✨ Features Implemented

### ✅ Must-Have Features
- **User Authentication** - Login/Signup with JWT tokens
- **Role-Based Access** - Admin and User roles with different permissions
- **Task Management** - Create, view, update, and delete tasks
- **Task Assignment** - Admin can assign tasks to specific users
- **Status Updates** - Users can mark tasks as complete/pending
- **Persistent Login** - Session persists after app restart
- **Beautiful UI** - Modern design with animations, statistics cards, and filters
- **Loading & Empty States** - Proper feedback for all user actions

### 🎁 Good-to-Have Features (Bonus)
- ✏️ **Edit/Delete Tasks** (Admin only)
- 🔍 **Filter Tasks** - By status (All/Pending/Completed)
- 📊 **Statistics Dashboard** - Real-time task counts
- 🎨 **Animated UI** - Smooth entrance animations
- 🔐 **JWT Token Authentication** - Secure API access
- 📱 **Cross-Platform** - Works on Web, Android, and iOS

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** (Expo) - Mobile framework
- **React Navigation** - Screen navigation
- **Axios** - API calls
- **AsyncStorage** - Local persistence
- **React Native Vector Icons** - Beautiful icons

### Backend (API Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password encryption

## 📁 Project Structure
task-manager-app/
├── backend/ # Node.js + Express server
│ ├── models/ # Database models (User, Task)
│ ├── controllers/ # Business logic
│ ├── routes/ # API endpoints
│ ├── middleware/ # Auth middleware
│ └── server.js # Server entry point
│
├── mobile/ # React Native app
│ ├── src/
│ │ ├── screens/ # Login, Tasks, CreateTask screens
│ │ ├── components/ # Reusable components (TaskCard)
│ │ ├── services/ # API services
│ │ └── utils/ # Auth utilities
│ └── App.js # App entry point
│
└── README.md # This file


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free) or local MongoDB
- Expo Go app (for mobile testing)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app

Step 2: Backend Setup
cd backend
npm install

Create a .env file in the backend folder
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000

Start the backend server
npm run dev

Step 3: Mobile App Setup
cd ../mobile
npm install
Update API URL in mobile/src/services/api.js:

For Android Emulator: Use http://10.0.2.2:5000/api

For Physical Device: Use http://YOUR_COMPUTER_IP:5000/api

For Web: Use http://localhost:5000/api

Start the app:
# For Web (easiest for testing)
npm run web

# For Android (with Expo Go)
npx expo start --tunnel

# For iOS (Mac only)
npm run ios

Step 4: Default Login Credentials
After first run, default users are auto-created:

Admin User:

Email: admin@taskmanager.com

Password: admin123

Regular User:

Email: user@taskmanager.com

Password: user123


## 📸 Screenshots

### Login Screen
![Login Screen](./screenshots/login-screen.png)

### Admin Tasks Dashboard
![Admin Tasks](./screenshots/tasks-admin.png)

### Create Task (Admin only)
![Create Task](./screenshots/create-task.png)