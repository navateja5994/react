import React from 'react';

const Card = ({ children }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(57, 255, 20, 0.1)',
      border: '2px solid #39ff14',
      borderRadius: '15px',
      boxShadow: '0 0 20px #39ff14',
      padding: '20px',
      margin: '20px auto',
      maxWidth: '600px',
      color: '#39ff14',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: 'center'
    }}>
      {children}
    </div>
  );
};

export default Card;
