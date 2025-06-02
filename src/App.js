import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EntryPage from './EntryPage';
import Home from './Home';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Auth from './Auth';
import UserProfile from './UserProfile';
import Leaderboard from './Leaderboard';
import Games from './Games';
import TicTacToe from './TicTacToe';
import BackgroundLayout from './BackgroundLayout';
import Tetris from './Tetris';
import Game2048 from './2048';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState({
    gamerTag: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          gamerTag: firebaseUser.displayName || '',
          username: firebaseUser.displayName || '',
          email: firebaseUser.email || ''
        });
      } else {
        setUser({
          gamerTag: '',
          username: '',
          email: ''
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1 className="logo">Games Platform</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
          <li><Link to="/auth">Signup/Login</Link></li>
          <li><Link to="/profile">User Profile</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/games">Games</Link></li>
        </ul>
      </nav>
      <BackgroundLayout>
        <div className="content">
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/auth" element={<Auth updateUser={updateUser} />} />
            <Route path="/profile" element={<UserProfile user={user} updateUser={updateUser} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/tetris" element={<Tetris />} />
            <Route path="/2048" element={<Game2048 />} />
          </Routes>
        </div>
      </BackgroundLayout>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
