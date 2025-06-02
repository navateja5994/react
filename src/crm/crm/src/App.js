import React, { useState } from 'react';
import './App.css';
import AdminAuth from './components/AdminAuth';
import UserAuth from './components/UserAuth';
import Chat from './components/Chat';
import AdminChatList from './components/AdminChatList';

function App() {
  const [userData, setUserData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleUserChanged = (data) => {
    setUserData(data);
    setSelectedRoom(null);
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRoom(roomId);
  };

  const toggleLoginType = () => {
    setUserData(null);
    setIsAdminLogin(!isAdminLogin);
  };

  return (
    <div className="App">
      {!userData ? (
        isAdminLogin ? (
          <AdminAuth onUserChanged={handleUserChanged} onSwitchToUser={toggleLoginType} />
        ) : (
          <UserAuth onUserChanged={handleUserChanged} onSwitchToAdmin={toggleLoginType} />
        )
      ) : userData.role === 'admin' ? (
        selectedRoom ? (
          <Chat
            user={userData.user}
            role={userData.role}
            roomId={selectedRoom}
            onBackToList={() => setSelectedRoom(null)}
          />
        ) : (
          <AdminChatList onSelectRoom={handleSelectRoom} />
        )
      ) : (
        // For clients, use their own roomId as their uid
        <Chat user={userData.user} role={userData.role} roomId={userData.user.uid} />
      )}
    </div>
  );
}

export default App;
