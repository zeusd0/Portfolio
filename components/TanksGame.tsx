'use client';

import React, { useState, useEffect, useCallback } from 'react';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface Bullet extends Position {
  dir: Direction;
  isEnemy?: boolean;
}

interface Enemy extends Position {
  id: number;
  dir: Direction;
}

export default function TanksGame() {
  const [tank, setTank] = useState<Position>({ x: 10, y: 13 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [playerBullets, setPlayerBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: 1, x: 2, y: 1, dir: 'DOWN' },
    { id: 2, x: 9, y: 1, dir: 'DOWN' },
    { id: 3, x: 17, y: 1, dir: 'DOWN' },
    { id: 4, x: 5, y: 4, dir: 'RIGHT' },
    { id: 5, x: 14, y: 4, dir: 'LEFT' },
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Выстрел игрока
  const shoot = useCallback(() => {
    if (isPaused || gameOver) return;
    setPlayerBullets((prev) => [...prev, { x: tank.x, y: tank.y, dir: direction }]);
  }, [tank, direction, isPaused, gameOver]);

  // Движение игрока
  const moveTank = useCallback((dir: Direction) => {
    if (isPaused || gameOver) return;
    setDirection(dir);
    setTank((prev) => {
      let { x, y } = prev;
      if (dir === 'UP' && y > 0) y--;
      if (dir === 'DOWN' && y < GRID_HEIGHT - 1) y++;
      if (dir === 'LEFT' && x > 0) x--;
      if (dir === 'RIGHT' && x < GRID_WIDTH - 1) x++;
      return { x, y };
    });
  }, [isPaused, gameOver]);

  // Управление с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
          moveTank('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
          moveTank('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
          moveTank('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
          moveTank('RIGHT');
          break;
        case ' ':
          shoot();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveTank, shoot]);

  // Движение и выстрелы противников (ИИ)
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
          let currentDir = enemy.dir;
          
          if (Math.random() < 0.25) {
            currentDir = dirs[Math.floor(Math.random() * dirs.length)];
          }

          let { x, y } = enemy;
          if (currentDir === 'UP' && y > 0) y--;
          else if (currentDir === 'DOWN' && y < GRID_HEIGHT - 1) y++;
          else if (currentDir === 'LEFT' && x > 0) x--;
          else if (currentDir === 'RIGHT' && x < GRID_WIDTH - 1) x++;

          // Враг случайно стреляет (шанс 35% за шаг)
          if (Math.random() < 0.35) {
            setEnemyBullets((prev) => [...prev, { x, y, dir: currentDir, isEnemy: true }]);
          }

          if (x === tank.x && y === tank.y) {
            setGameOver(true);
          }

          return { ...enemy, x, y, dir: currentDir };
        })
      );
    }, 450);

    return () => clearInterval(interval);
  }, [isPaused, gameOver, tank]);

  // Полет снарядов игрока
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setPlayerBullets((prevBullets) => {
        const nextBullets: Bullet[] = [];

        prevBullets.forEach((bullet) => {
          let { x, y, dir } = bullet;
          if (dir === 'UP') y--;
          if (dir === 'DOWN') y++;
          if (dir === 'LEFT') x--;
          if (dir === 'RIGHT') x++;

          if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
            let hit = false;
            setEnemies((prevEnemies) => {
              const hitEnemy = prevEnemies.find((e) => e.x === x && e.y === y);
              if (hitEnemy) {
                hit = true;
                setScore((s) => s + 100);
                return prevEnemies.filter((e) => e.id !== hitEnemy.id);
              }
              return prevEnemies;
            });

            if (!hit) {
              nextBullets.push({ x, y, dir });
            }
          }
        });

        return nextBullets;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isPaused, gameOver]);

  // Полет снарядов врагов и проверкa попадания в игрока
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setEnemyBullets((prevBullets) => {
        const nextBullets: Bullet[] = [];

        prevBullets.forEach((bullet) => {
          let { x, y, dir } = bullet;
          if (dir === 'UP') y--;
          if (dir === 'DOWN') y++;
          if (dir === 'LEFT') x--;
          if (dir === 'RIGHT') x++;

          if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
            // Попадание в танк игрока
            if (x === tank.x && y === tank.y) {
              setGameOver(true);
            } else {
              nextBullets.push({ x, y, dir, isEnemy: true });
            }
          }
        });

        return nextBullets;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, gameOver, tank]);

  // Перезапуск игры
  const restartGame = () => {
    setTank({ x: 10, y: 13 });
    setDirection('UP');
    setPlayerBullets([]);
    setEnemyBullets([]);
    setEnemies([
      { id: 1, x: 2, y: 1, dir: 'DOWN' },
      { id: 2, x: 9, y: 1, dir: 'DOWN' },
      { id: 3, x: 17, y: 1, dir: 'DOWN' },
      { id: 4, x: 5, y: 4, dir: 'RIGHT' },
      { id: 5, x: 14, y: 4, dir: 'LEFT' },
    ]);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const getDirIcon = (dir: Direction) => {
    switch (dir) {
      case 'UP': return '▲';
      case 'DOWN': return '▼';
      case 'LEFT': return '◀';
      case 'RIGHT': return '▶';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
      <div className="flex justify-between w-full items-center px-2">
        <h2 className="text-2xl font-bold text-amber-400">Танчики</h2>
        <div className="text-lg font-semibold bg-slate-800 px-4 py-1 rounded-lg">
          Очки: <span className="text-amber-400">{score}</span>
        </div>
      </div>

      {/* Игровое поле */}
      <div
        className="relative bg-slate-950 border-2 border-slate-700 rounded-lg overflow-hidden w-full"
        style={{
          aspectRatio: '20 / 15',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
        }}
      >
        {/* Экран состояния */}
        {(isPaused || gameOver || enemies.length === 0) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
            {gameOver ? (
              <h3 className="text-2xl font-bold text-red-500">Ваш танк подбит!</h3>
            ) : enemies.length === 0 ? (
              <h3 className="text-2xl font-bold text-emerald-400">Все противники уничтожены!</h3>
            ) : (
              <p className="text-gray-300 text-xs sm:text-sm">
                WASD / Стрелки: Перемещение<br />
                Пробел: Выстрел
              </p>
            )}
            <button
              onClick={restartGame}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              {isPaused ? 'Начать игру' : 'Сыграть заново'}
            </button>
          </div>
        )}

        {/* Танк игрока */}
        <div
          className="bg-amber-500 rounded flex items-center justify-center font-bold text-slate-950 text-xs transition-all shadow-md shadow-amber-500/50"
          style={{
            gridColumnStart: tank.x + 1,
            gridRowStart: tank.y + 1,
          }}
        >
          {getDirIcon(direction)}
        </div>

        {/* Противники */}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="bg-red-600 border border-red-400 rounded flex items-center justify-center font-bold text-white text-xs transition-all shadow-md shadow-red-500/50"
            style={{
              gridColumnStart: enemy.x + 1,
              gridRowStart: enemy.y + 1,
            }}
          >
            {getDirIcon(enemy.dir)}
          </div>
        ))}

        {/* Снаряды игрока (Желтые) */}
        {playerBullets.map((b, i) => (
          <div
            key={`p-${i}`}
            className="bg-yellow-300 rounded-full animate-ping"
            style={{
              gridColumnStart: b.x + 1,
              gridRowStart: b.y + 1,
            }}
          />
        ))}

        {/* Снаряды врагов (Красные) */}
        {enemyBullets.map((b, i) => (
          <div
            key={`e-${i}`}
            className="bg-red-500 rounded-full animate-ping"
            style={{
              gridColumnStart: b.x + 1,
              gridRowStart: b.y + 1,
            }}
          />
        ))}
      </div>

      {/* Экранные кнопки для мобильных устройств */}
      <div className="flex flex-col items-center gap-2 md:hidden mt-2">
        <button
          onClick={() => moveTank('UP')}
          className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => moveTank('LEFT')}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ◀
          </button>
          <button
            onClick={shoot}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 w-16 h-10 rounded font-bold"
          >
            🔥
          </button>
          <button
            onClick={() => moveTank('RIGHT')}
            className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => moveTank('DOWN')}
          className="bg-slate-800 hover:bg-slate-700 w-12 h-10 rounded font-bold"
        >
          ▼
        </button>
      </div>
    </div>
  );
}