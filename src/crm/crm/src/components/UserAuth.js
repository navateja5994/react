import React, { useState } from 'react';
import { userAuth, userDb } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Auth.css';

const UserAuth = ({ onUserChanged, onSwitchToAdmin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setError('');
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(userAuth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(userAuth, email, password);
        // Save user role in Firestore
        const user = userCredential.user;
        await setDoc(doc(userDb, 'users', user.uid), {
          email: user.email,
          role: 'user',
          createdAt: new Date(),
        });
      }
      const user = userCredential.user;
      onUserChanged({ user, role: 'user' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'User Login' : 'User Sign Up'}</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span className="toggle-link" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
      <div style={{ marginTop: '20px' }}>
        <button onClick={onSwitchToAdmin}>Admin Login</button>
      </div>
    </div>
  );
};

export default UserAuth;
