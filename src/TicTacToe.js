import React, { useState, useEffect } from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import Card from './Card';
import { auth } from './firebase';
import { saveScore } from './scoreService';

const initialBoard = Array(9).fill(null);

const calculateWinner = (board) => {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState(0);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
    setScore(0);
  };

  useEffect(() => {
    if (winner && auth.currentUser) {
      let finalScore = 0;
      if (winner === 'X') finalScore = 1;
      else if (winner === 'O') finalScore = 2;
      else finalScore = 0;
      console.log('Saving TicTacToe score:', finalScore, 'for user:', auth.currentUser.uid);
      saveScore(auth.currentUser.uid, 'tictactoe', finalScore)
        .then(() => console.log('TicTacToe score saved successfully'))
        .catch(err => console.error('Error saving TicTacToe score:', err));
    }
  }, [winner]);

  const renderSquare = (index) => (
    <button 
      onClick={() => handleClick(index)} 
      style={{
        width: '60px',
        height: '60px',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundColor: '#000',
        color: '#39ff14',
        border: '2px solid #39ff14',
        outline: 'none'
      }}
    >
      {board[index]}
    </button>
  );

  return (
    <BackgroundLayout>
      <Card>
        <BackButton />
        <h2 style={{ color: '#39ff14', textAlign: 'center' }}>Tic Tac Toe</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 60px)', 
          gridGap: '10px', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {board.map((_, i) => renderSquare(i))}
        </div>
        <div style={{ textAlign: 'center', color: '#39ff14', marginBottom: '20px' }}>
          {winner ? `Winner: ${winner}` : `Next Player: ${xIsNext ? 'X' : 'O'}`}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleReset} 
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#39ff14',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reset Game
          </button>
        </div>
      </Card>
    </BackgroundLayout>
  );
};

export default TicTacToe;
