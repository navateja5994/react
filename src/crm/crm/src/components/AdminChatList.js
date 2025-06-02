import React, { useEffect, useState } from 'react';
import { adminDb } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './AdminChatList.css';

const AdminChatList = ({ onSelectRoom }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(adminDb, 'users');
        const usersSnapshot = await getDocs(usersCol);
        const usersList = usersSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(user => user.role === 'user');
        console.log('Fetched users:', usersList);
        setUsers(usersList);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users: ' + err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-chatlist-container">
      <h2>User List</h2>
      <button onClick={() => onSelectRoom(null)} style={{ marginBottom: '10px' }}>
        Back to Chats
      </button>
      {error ? (
        <p className="error-message">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="chatlist">
          {users.map((user) => (
            <li key={user.id} onClick={() => onSelectRoom(user.id)} className="chatlist-item">
              <div className="chatlist-avatar">{user.email ? user.email.charAt(0).toUpperCase() : user.id.charAt(0).toUpperCase()}</div>
              <div className="chatlist-info">
                <div className="chatlist-name">{user.email || user.id}</div>
                <div className="chatlist-role">{user.role}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminChatList;
