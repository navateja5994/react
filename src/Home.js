import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import BackgroundLayout from './BackgroundLayout';

const Home = () => {
  return (
    <BackgroundLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          maxHeight: '100vh',
          overflowY: 'visible',
          textAlign: 'center',
          position: 'relative',
          borderRadius: '15px',
          padding: '20px 20px 20px 0px',
          marginTop: '0px',
          marginBottom: '0px',
          gap: '0px',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            border: '3px solid #39ff14',
            borderRadius: '15px',
            padding: '0px',
            boxShadow: '0 0 20px #39ff14',
            marginBottom: '20px',
            display: 'inline-block',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            width: '260px',
            height: '260px',
            textAlign: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <img
            src={logo}
            alt="Games Platform Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h1
          style={{
            color: '#39ff14',
            textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14',
            zIndex: 1,
            position: 'relative',
            marginBottom: '20px',
          }}
        >
          Eenavis-Game World
        </h1>
        <p style={{ zIndex: 1, position: 'relative', marginBottom: '15px' }}>
          Welcome to the ultimate destination for gamers! Our platform offers a
          wide variety of games across multiple genres, connecting players from
          around the world.
        </p>
        <p style={{ zIndex: 1, position: 'relative', marginBottom: '15px' }}>
          We are passionate about gaming and strive to provide the best
          experience with leaderboards, user profiles, and community features.
        </p>
        <p style={{ zIndex: 1, position: 'relative', marginBottom: '30px' }}>
          Join us and level up your gaming journey!
        </p>
        <div
          style={{
            marginTop: '0px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <Link to="/about-us" style={buttonStyle}>
            About Us
          </Link>
          <Link to="/contact-us" style={buttonStyle}>
            Contact Us
          </Link>
          <Link to="/games" style={buttonStyle}>
            Games
          </Link>
          <Link to="/auth" style={buttonStyle}>
            Login/Signup
          </Link>
          <Link to="/profile" style={buttonStyle}>
            User Profile
          </Link>
          <Link to="/leaderboard" style={buttonStyle}>
            Leaderboard
          </Link>
        </div>
      </div>
    </BackgroundLayout>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#39ff14',
  color: '#000',
  fontWeight: 'bold',
  borderRadius: '10px',
  textDecoration: 'none',
  boxShadow: '0 0 10px #39ff14',
  transition: 'background-color 0.3s ease',
  cursor: 'pointer',
};

export default Home;
