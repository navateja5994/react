import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import Card from './Card';
import { auth, googleProvider } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';

const Auth = ({ updateUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    gamerTag: '',
    username: '',
    email: '',
    password: '',
    avatar: null
  });
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ gamerTag: '', username: '', email: '', password: '', avatar: null });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        // Login with email and password
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        updateUser({
          gamerTag: formData.gamerTag,
          username: formData.username,
          email: user.email,
          avatarUrl: user.photoURL || ''
        });
        navigate('/profile');
      } else {
        // Signup with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        // Update profile with gamerTag, username and avatar if provided
        let photoURL = '';
        if (formData.avatar) {
          photoURL = URL.createObjectURL(formData.avatar);
          await updateProfile(user, { photoURL });
        }
        await updateProfile(user, { displayName: formData.username });
        updateUser({
          gamerTag: formData.gamerTag,
          username: formData.username,
          email: user.email,
          avatarUrl: photoURL
        });
        setIsLogin(true); // Redirect to login after signup
      }
      setFormData({ gamerTag: '', username: '', email: '', password: '', avatar: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      updateUser({
        gamerTag: user.displayName || '',
        username: user.displayName || '',
        email: user.email,
        avatarUrl: user.photoURL || ''
      });
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BackgroundLayout>
      <Card>
        <BackButton />
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <label>Email:</label><br />
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required /><br />
              <label>Avatar:</label><br />
              <input type="file" name="avatar" accept="image/*" onChange={handleChange} /><br />
            </>
          )}
          {isLogin && (
            <>
              <label>Email:</label><br />
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required /><br />
            </>
          )}
          <label>Password:</label><br />
          <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required /><br />
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>
        <button onClick={toggleForm} className="toggle-btn">
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </button>
        <hr />
        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          Sign in with Google
        </button>
      </Card>
    </BackgroundLayout>
  );
};

export default Auth;
