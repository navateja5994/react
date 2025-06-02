import React, { useState, useEffect, useRef } from 'react';
import { auth } from './firebase';
import { saveScore } from './scoreService';
import BackButton from './BackButton';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const shapes = [
  [],
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]]  // Z
];

const colors = [
  'none',
  'cyan',
  'yellow',
  'purple',
  'blue',
  'orange',
  'green',
  'red'
];

function randomShape() {
  const index = Math.floor(Math.random() * (shapes.length - 1)) + 1;
  return { shape: shapes[index], index };
}

const Tetris = () => {
  const [board, setBoard] = useState(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [current, setCurrent] = useState({ shape: [], index: 0, x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  const checkCollision = (shape, x, y, boardState) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const newX = x + j;
          const newY = y + i;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && boardState[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const mergeShapeToBoard = (shape, x, y, boardState, index) => {
    const newBoard = boardState.map(row => row.slice());
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const newY = y + i;
          const newX = x + j;
          if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
            newBoard[newY][newX] = index;
          }
        }
      }
    }
    return newBoard;
  };

  const clearLines = (boardState) => {
    let linesCleared = 0;
    const newBoard = boardState.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (newBoard.length < ROWS) {
      newBoard.unshift(Array(COLS).fill(0));
    }
    return { newBoard, linesCleared };
  };

  const spawnNewShape = () => {
    const nextShape = randomShape();
    const startX = Math.floor((COLS - nextShape.shape[0].length) / 2);
    if (checkCollision(nextShape.shape, startX, 0, board)) {
      setGameOver(true);
      return null;
    }
    return { ...nextShape, x: startX, y: -nextShape.shape.length + 1 };
  };

  const moveDown = () => {
    if (gameOver) return;
    if (!checkCollision(current.shape, current.x, current.y + 1, board)) {
      setCurrent(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      const newBoard = mergeShapeToBoard(current.shape, current.x, current.y, board, current.index);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      setScore(prev => prev + linesCleared * 10);
      const newShape = spawnNewShape();
      if (newShape) {
        setCurrent(newShape);
      }
    }
  };

  const hardDrop = () => {
    if (gameOver) return;
    let y = current.y;
    while (!checkCollision(current.shape, current.x, y + 1, board)) {
      y++;
    }
    const newBoard = mergeShapeToBoard(current.shape, current.x, y, board, current.index);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    setScore(prev => prev + linesCleared * 10);
    const newShape = spawnNewShape();
    if (newShape) setCurrent(newShape);
  };

  const moveLeft = () => {
    if (gameOver) return;
    if (!checkCollision(current.shape, current.x - 1, current.y, board)) {
      setCurrent(prev => ({ ...prev, x: prev.x - 1 }));
    }
  };

  const moveRight = () => {
    if (gameOver) return;
    if (!checkCollision(current.shape, current.x + 1, current.y, board)) {
      setCurrent(prev => ({ ...prev, x: prev.x + 1 }));
    }
  };

  const tryRotate = () => {
    if (gameOver || !current.shape.length) return;
    const rotatedShape = current.shape[0].map((_, index) =>
      current.shape.map(row => row[index])
    ).reverse();

    const offsets = [0, -1, 1, -2, 2];
    for (let offset of offsets) {
      if (!checkCollision(rotatedShape, current.x + offset, current.y, board)) {
        setCurrent(prev => ({
          ...prev,
          shape: rotatedShape,
          x: prev.x + offset
        }));
        break;
      }
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        tryRotate();
        break;
      case ' ':
        e.preventDefault();
        hardDrop();
        break;
      default:
        break;
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    setScore(0);
    setGameOver(false);
    const newShape = spawnNewShape();
    if (newShape) setCurrent(newShape);
  };

  useEffect(() => {
    const newShape = spawnNewShape();
    if (newShape) setCurrent(newShape);
    const interval = setInterval(() => {
      moveDown();
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      console.log('Saving Tetris score:', score, 'for user:', auth.currentUser.uid);
      saveScore(auth.currentUser.uid, 'tetris', score)
        .then(() => console.log('Tetris score saved successfully'))
        .catch(err => console.error('Error saving Tetris score:', err));
    }
  }, [score]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none', textAlign: 'center', color: '#39ff14' }}
    >
      <BackButton />
      <h1>Tetris Game</h1>
      <p>Score: {score}</p>
      {gameOver && (
        <>
          <p>Game Over!</p>
          <button onClick={resetGame}>Restart</button>
        </>
      )}
      <div
        style={{
          display: 'inline-block',
          backgroundColor: '#000',
          border: '2px solid #39ff14',
          width: COLS * BLOCK_SIZE,
          height: ROWS * BLOCK_SIZE,
          position: 'relative',
          margin: '0 auto'
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                boxSizing: 'border-box',
                border: '1px solid #222',
                backgroundColor: cell === 0 ? '#000' : colors[cell],
                position: 'absolute',
                top: y * BLOCK_SIZE,
                left: x * BLOCK_SIZE
              }}
            />
          ))
        )}
        {current.shape.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <div
                key={`current-${y}-${x}`}
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  boxSizing: 'border-box',
                  border: '1px solid #555',
                  backgroundColor: colors[current.index],
                  position: 'absolute',
                  top: (current.y + y) * BLOCK_SIZE,
                  left: (current.x + x) * BLOCK_SIZE
                }}
              />
            ) : null
          )
        )}
      </div>
      <p>Use arrow keys to move and rotate. Spacebar for hard drop.</p>
    </div>
  );
};

export default Tetris;
