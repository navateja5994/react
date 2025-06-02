import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to = '/' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 16px',
        backgroundColor: '#39ff14',
        color: '#000',
        fontWeight: 'bold',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 10px #39ff14',
        transition: 'background-color 0.3s ease',
        zIndex: 1000
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = '#2ecc40'}
      onMouseOut={e => e.currentTarget.style.backgroundColor = '#39ff14'}
    >
      Back
    </button>
  );
};

export default BackButton;
