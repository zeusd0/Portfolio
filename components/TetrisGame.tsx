'use client';

import React, { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Фигуры тетриса (Тетрамино)
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};

type TetrominoKey = keyof typeof TETROMINOS;

const getRandomTetromino = () => {
  const keys = Object.keys(TETROMINOS) as TetrominoKey[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOS[randKey], key: randKey };
};

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export default function TetrisGame() {
  const [board, setBoard] = useState<(string | number)[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    x: number;
    y: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Проверка столкновений
  const checkCollision = (piece: typeof currentPiece, boardData: typeof board, moveX = 0, moveY = 0) => {
    if (!piece) return false;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] !== 0) {
          const newX = piece.x + c + moveX;
          const newY = piece.y + r + moveY;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && boardData[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Спавн новой фигуры
  const spawnPiece = useCallback((currentBoard: typeof board) => {
    const newPieceData = getRandomTetromino();
    const newPiece = {
      shape: newPieceData.shape,
      color: newPieceData.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPieceData.shape[0].length / 2),
      y: 0,
    };

    if (checkCollision(newPiece, currentBoard)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
    }
  }, []);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnPiece(createEmptyBoard());
  };

  // Поворот фигуры
  const rotatePiece = () => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    );
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };
    if (!checkCollision(rotatedPiece, board)) {
      setCurrentPiece(rotatedPiece);
    }
  };

  // Движение влево/вправо/вниз
  const move = (dirX: number) => {
    if (!currentPiece || gameOver || isPaused) return;
    if (!checkCollision(currentPiece, board, dirX, 0)) {
      setCurrentPiece((prev) => prev && { ...prev, x: prev.x + dirX });
    }
  };

  const drop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    if (!checkCollision(currentPiece, board, 0, 1)) {
      setCurrentPiece((prev) => prev && { ...prev, y: prev.y + 1 });
    } else {
      // Закрепление фигуры на поле
      const newBoard = board.map((row) => [...row]);
      currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0 && currentPiece.y + r >= 0) {
            newBoard[currentPiece.y + r][currentPiece.x + c] = currentPiece.color;
          }
        });
      });

      // Очистка заполненных линий
      let linesCleared = 0;
      const filteredBoard = newBoard.reduce((acc, row) => {
        if (row.every((cell) => cell !== 0)) {
          linesCleared++;
          acc.unshift(Array(BOARD_WIDTH).fill(0));
        } else {
          acc.push(row);
        }
        return acc;
      }, [] as (string | number)[][]);

      if (linesCleared > 0) {
        setScore((s) => s + linesCleared * 100);
      }

      setBoard(filteredBoard);
      spawnPiece(filteredBoard);
    }
  }, [currentPiece, board, gameOver, isPaused, spawnPiece]);

  // Управление с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
          move(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
          move(1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
          drop();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, board, gameOver, isPaused, drop]);

  // Таймер падения блоков
  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      drop();
    }, 600);
    return () => clearInterval(interval);
  }, [drop, gameOver, isPaused]);

  // Отрисовка игрового поля с учетом летящей фигуры
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            const y = currentPiece.y + r;
            const x = currentPiece.x + c;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = currentPiece.color;
            }
          }
        });
      });
    }
    return displayBoard;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl max-w-md mx-auto">
      <div className="flex justify-between w-full items-center px-2">
        <h2 className="text-2xl font-bold text-cyan-400">🧱 Тетрис</h2>
        <div className="text-lg font-semibold bg-slate-800 px-4 py-1 rounded-lg">
          Счет: <span className="text-cyan-400">{score}</span>
        </div>
      </div>

      {/* Игровое поле */}
      <div
        className="relative bg-slate-950 border-2 border-slate-700 rounded-lg overflow-hidden"
        style={{
          width: '240px',
          height: '480px',
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {/* Стартовый экран */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
            <p className="text-gray-300 text-xs">
              ▲ / W: Поворот<br />
              ◄ ► / A D: Влево/Вправо<br />
              ▼ / S: Ускорение
            </p>
            <button
              onClick={startGame}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Начать игру
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-10">
            <h3 className="text-2xl font-bold text-red-500">Игра окончена!</h3>
            <p className="text-slate-300">Счет: {score}</p>
            <button
              onClick={startGame}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Заново
            </button>
          </div>
        )}

        {/* Сетка клеток */}
        {renderBoard().map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`border-[0.5px] border-slate-900/40 ${
                cell !== 0 ? (cell as string) : 'bg-slate-950'
              }`}
            />
          ))
        )}
      </div>

      {/* Сенсорное управление для мобильных */}
      <div className="flex flex-col items-center gap-2 md:hidden mt-2">
        <button
          onClick={rotatePiece}
          className="bg-slate-800 hover:bg-slate-700 w-16 h-10 rounded font-bold text-cyan-400"
        >
          🔄
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => move(-1)}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ◀
          </button>
          <button
            onClick={drop}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => move(1)}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}