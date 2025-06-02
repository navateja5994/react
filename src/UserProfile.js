import React, { useState, useEffect } from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import Card from './Card';
import logo from './new.png';

import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const UserProfile = ({ user, updateUser }) => {
  const [profile, setProfile] = useState({
    gamerTag: user.gamerTag || '',
    username: user.username || '',
    email: user.email || '',
    avatarUrl: logo
  });

  useEffect(() => {
    setProfile({
      gamerTag: user.gamerTag || '',
      username: user.username || '',
      email: user.email || '',
      avatarUrl: logo
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    alert('Profile saved!');
    // Here you would typically send the updated profile to a server
  };

  const handleLogout = async () => {
    await signOut(auth);
    updateUser({ gamerTag: '', username: '', email: '' });
  };

  return (
    <BackgroundLayout>
      <Card>
        <BackButton />
        <h1>User Profile</h1>
        <img src={profile.avatarUrl} alt="Avatar" width="150" height="150" />
        <form>
          <label>Gamer Tag:</label><br />
          <input type="text" name="gamerTag" placeholder="Enter your gamer tag" value={profile.gamerTag} onChange={handleChange} /><br />
          <label>Username:</label><br />
          <input type="text" name="username" placeholder="Enter your username" value={profile.username} onChange={handleChange} /><br />
          <label>Email:</label><br />
          <input type="email" name="email" placeholder="Enter your email" value={profile.email} onChange={handleChange} /><br />
          <button type="button" onClick={handleSave}>Save Profile</button>
        </form>
        <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#f44336', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </Card>
    </BackgroundLayout>
  );
};

export default UserProfile;
