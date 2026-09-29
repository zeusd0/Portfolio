'use client';

import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Вверх

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Генерация случайной еды
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  // Сброс игры
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  // Обработка нажатий клавиш (с исправлением поворотов и русской раскладки)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Предотвращаем прокрутку страницы стрелками
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
          setDirection((prev) => (prev.y === 0 ? { x: 0, y: -1 } : prev));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
          setDirection((prev) => (prev.y === 0 ? { x: 0, y: 1 } : prev));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
          setDirection((prev) => (prev.x === 0 ? { x: -1, y: 0 } : prev));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
          setDirection((prev) => (prev.x === 0 ? { x: 1, y: 0 } : prev));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  // Главный игровой цикл (таймер)
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Столкновение со стенами
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Столкновение с собственным хвостом
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Поедание еды
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl max-w-md mx-auto">
      <div className="flex justify-between w-full items-center px-2">
        <h2 className="text-2xl font-bold text-emerald-400">🐍 Змейка</h2>
        <div className="text-lg font-semibold bg-slate-800 px-4 py-1 rounded-lg">
          Счет: <span className="text-emerald-400">{score}</span>
        </div>
      </div>

      {/* Игровое поле */}
      <div
        className="relative bg-slate-950 border-2 border-slate-700 rounded-lg overflow-hidden"
        style={{
          width: '320px',
          height: '320px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Экран старта */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 z-10">
            <p className="text-gray-300 text-sm">Управление: Стрелки / WASD</p>
            <button
              onClick={() => setIsPaused(false)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Начать игру
            </button>
          </div>
        )}

        {/* Экран Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-10">
            <h3 className="text-2xl font-bold text-red-500">Игра окончена!</h3>
            <p className="text-slate-300">Финальный счет: {score}</p>
            <button
              onClick={restartGame}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Заново
            </button>
          </div>
        )}

        {/* Еда */}
        <div
          className="bg-red-500 rounded-full animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Змейка */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`${
              index === 0 ? 'bg-emerald-400 rounded-sm' : 'bg-emerald-600 rounded-sm'
            }`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}
      </div>

      {/* Экранные кнопки управления для мобильных устройств */}
      <div className="flex flex-col items-center gap-1 md:hidden mt-2">
        <button
          onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
          className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}