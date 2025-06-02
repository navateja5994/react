import React, { useEffect, useState, useRef } from 'react';
import { adminDb, userDb } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import './Chat.css';

const Chat = ({ user, role, roomId, onBackToList }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const db = role === 'admin' ? adminDb : userDb;
    const messagesRef = collection(db, 'chats', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [roomId, role]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMsg.trim() === '') return;

    const db = role === 'admin' ? adminDb : userDb;
    const messagesRef = collection(db, 'chats', roomId, 'messages');
    try {
      await addDoc(messagesRef, {
        text: newMsg,
        senderId: user.uid,
        senderRole: role,
        createdAt: serverTimestamp(),
      });
      setNewMsg('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClearChat = async () => {
    // Only admin can clear chat
    if (role !== 'admin') return;

    const messagesRef = collection(adminDb, 'chats', roomId, 'messages');
    const q = query(messagesRef);
    try {
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(adminDb, 'chats', roomId, 'messages', docSnap.id));
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat Room: {roomId}</h3>
        {role === 'admin' && (
          <>
            <button
              onClick={onBackToList}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              type="button"
            >
              Back to Chat List
            </button>
            <button className="clear-btn" onClick={handleClearChat}>
              Clear Chat
            </button>
          </>
        )}
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === user.uid ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">
              {msg.text && <span>{msg.text}</span>}
            </div>
            <div className="message-meta">
              <small>{msg.senderRole}</small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
