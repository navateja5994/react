import React, { useState, useEffect, useRef } from 'react';
import { auth } from './firebase';
import { saveScore } from './scoreService';
import BackButton from './BackButton';

const SIZE = 4;
const BLOCK_SIZE = 100;

function getEmptyBoard() {
  return Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function addRandomTile(board) {
  const emptyPositions = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) emptyPositions.push([r, c]);
    }
  }
  if (emptyPositions.length === 0) return board;
  const [row, col] = emptyPositions[getRandomInt(emptyPositions.length)];
  const newBoard = board.map(row => row.slice());
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function rotateBoard(board) {
  const newBoard = getEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newBoard[c][SIZE - 1 - r] = board[r][c];
    }
  }
  return newBoard;
}

function moveLeft(board) {
  let newBoard = getEmptyBoard();
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    let row = board[r].filter(val => val !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }
    row = row.filter(val => val !== 0);
    for (let c = 0; c < row.length; c++) {
      newBoard[r][c] = row[c];
    }
  }
  return { newBoard, score };
}

function moveRight(board) {
  let reversed = board.map(row => row.slice().reverse());
  let { newBoard, score } = moveLeft(reversed);
  newBoard = newBoard.map(row => row.slice().reverse());
  return { newBoard, score };
}

function moveUp(board) {
  let rotated = rotateBoard(board);
  let { newBoard, score } = moveLeft(rotated);
  for (let i = 0; i < 3; i++) {
    newBoard = rotateBoard(newBoard);
  }
  return { newBoard, score };
}

function moveDown(board) {
  let rotated = rotateBoard(board);
  let { newBoard, score } = moveRight(rotated);
  for (let i = 0; i < 3; i++) {
    newBoard = rotateBoard(newBoard);
  }
  return { newBoard, score };
}

function boardsEqual(b1, b2) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
}

function canMove(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function getColor(value) {
  switch (value) {
    case 2: return '#eee4da';
    case 4: return '#ede0c8';
    case 8: return '#f2b179';
    case 16: return '#f59563';
    case 32: return '#f67c5f';
    case 64: return '#f65e3b';
    case 128: return '#edcf72';
    case 256: return '#edcc61';
    case 512: return '#edc850';
    case 1024: return '#edc53f';
    case 2048: return '#edc22e';
    default: return '#3c3a32';
  }
}

const Game2048 = () => {
  const [board, setBoard] = useState(getEmptyBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let newBoard = addRandomTile(board);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    if (containerRef.current) containerRef.current.focus();
  }, []);

  useEffect(() => {
    if (gameOver && auth.currentUser) {
      console.log('Saving 2048 score:', score, 'for user:', auth.currentUser.uid);
      saveScore(auth.currentUser.uid, '2048', score)
        .then(() => console.log('2048 score saved successfully'))
        .catch(err => console.error('Error saving 2048 score:', err));
    }
  }, [gameOver, score]);

  const handleKeyDown = (e) => {
    if (gameOver) return;
    let newScore = 0;
    let newBoard = board;
    switch (e.key) {
      case 'ArrowLeft':
        ({ newBoard, score: newScore } = moveLeft(board));
        break;
      case 'ArrowRight':
        ({ newBoard, score: newScore } = moveRight(board));
        break;
      case 'ArrowUp':
        ({ newBoard, score: newScore } = moveUp(board));
        break;
      case 'ArrowDown':
        ({ newBoard, score: newScore } = moveDown(board));
        break;
      default:
        return;
    }

    if (!boardsEqual(board, newBoard)) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prev => prev + newScore);
      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none',
        textAlign: 'center',
        color: '#776e65',
        userSelect: 'none',
        fontFamily: 'sans-serif'
      }}
    >
      <BackButton />
      <h1>2048 Game</h1>
      <p>Score: {score}</p>
      {gameOver && <p style={{ fontWeight: 'bold', color: 'red' }}>Game Over!</p>}
      <div
        style={{
          display: 'inline-block',
          backgroundColor: '#bbada0',
          padding: 10,
          borderRadius: 5,
          width: SIZE * BLOCK_SIZE,
          height: SIZE * BLOCK_SIZE,
          position: 'relative',
          marginBottom: 20
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: BLOCK_SIZE - 10,
                height: BLOCK_SIZE - 10,
                backgroundColor: cell === 0 ? '#cdc1b4' : getColor(cell),
                color: cell <= 4 ? '#776e65' : '#f9f6f2',
                fontWeight: 'bold',
                fontSize: 24,
                lineHeight: `${BLOCK_SIZE - 10}px`,
                textAlign: 'center',
                borderRadius: 3,
                position: 'absolute',
                top: r * BLOCK_SIZE,
                left: c * BLOCK_SIZE,
              }}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>
      <p>Use arrow keys to move tiles.</p>
    </div>
  );
};

export default Game2048;
