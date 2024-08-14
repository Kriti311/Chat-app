import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// import SignupPage from './pages/SignupPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/Profile';
import LogoutPage from './pages/LogoutPage';
import Register from './pages/Register';
import ChatRoom from './pages/ChatRoom';
import CreateChatRoom from './pages/CreateChatRoom';
import ChatRoomList from './pages/ChatRoomlist';
import ChatRoomDetail from './pages/ChatRoomDetail';
const App = () => {
  const handleRoomCreated = (roomData) => {
      // Logic to handle room creation
      console.log('Room created:', roomData);
  };

// function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chats" element={<ChatRoomList />} />
        {/* <Route path="/chat/:id" element={<ChatRoomDetail />} /> */}
        <Route path="/chat/:roomName" element={<ChatRoom />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/createchatroom" element={<CreateChatRoom onRoomCreated={handleRoomCreated}/>} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
}


export default App;
// npm run dev