'use client';

import React, { useState, useEffect } from 'react';

const INITIAL_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
  [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
  [1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1],
  [2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2],
  [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
  [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
  [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,3,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,3,1],
  [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function PacmanGame() {
  const [map, setMap] = useState<number[][]>(INITIAL_MAP);
  const [pacman, setPacman] = useState<Position>({ x: 9, y: 16 });
  const [dir, setDir] = useState<Direction>('RIGHT');
  const [nextDir, setNextDir] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isScared, setIsScared] = useState(false);

  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 1, x: 9, y: 9, color: 'bg-red-500' },
    { id: 2, x: 8, y: 10, color: 'bg-pink-400' },
    { id: 3, x: 10, y: 10, color: 'bg-cyan-400' },
  ]);

  const isWall = (x: number, y: number) => {
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return true;
    return map[y][x] === 1;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': setNextDir('UP'); break;
        case 'ArrowDown': case 's': case 'S': setNextDir('DOWN'); break;
        case 'ArrowLeft': case 'a': case 'A': setNextDir('LEFT'); break;
        case 'ArrowRight': case 'd': case 'D': setNextDir('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const speed = Math.max(120, 250 - level * 20);

    const timer = setInterval(() => {
      setPacman((prev) => {
        let currentDir = dir;
        let dx = 0, dy = 0;
        if (nextDir === 'UP') dy = -1;
        if (nextDir === 'DOWN') dy = 1;
        if (nextDir === 'LEFT') dx = -1;
        if (nextDir === 'RIGHT') dx = 1;

        if (!isWall(prev.x + dx, prev.y + dy)) {
          currentDir = nextDir;
          setDir(nextDir);
        } else {
          dx = 0; dy = 0;
          if (currentDir === 'UP') dy = -1;
          if (currentDir === 'DOWN') dy = 1;
          if (currentDir === 'LEFT') dx = -1;
          if (currentDir === 'RIGHT') dx = 1;
        }

        const newX = prev.x + dx;
        const newY = prev.y + dy;

        if (isWall(newX, newY)) return prev;

        setMap((prevMap) => {
          const currentCell = prevMap[newY][newX];
          if (currentCell === 0 || currentCell === 3) {
            const updated = prevMap.map((row) => [...row]);
            updated[newY][newX] = 2;

            setScore((s) => s + (currentCell === 3 ? 50 : 10));

            if (currentCell === 3) {
              setIsScared(true);
              setTimeout(() => setIsScared(false), 7000);
            }

            const hasFood = updated.some((row) => row.some((cell) => cell === 0 || cell === 3));
            if (!hasFood) {
              setLevel((l) => l + 1);
              setMap(INITIAL_MAP);
            }

            return updated;
          }
          return prevMap;
        });

        return { x: newX, y: newY };
      });

      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const directions: Position[] = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
          ];

          const validDirs = directions.filter(
            (d) => !isWall(ghost.x + d.x, ghost.y + d.y)
          );

          if (validDirs.length === 0) return ghost;

          const randomDir = validDirs[Math.floor(Math.random() * validDirs.length)];
          return {
            ...ghost,
            x: ghost.x + randomDir.x,
            y: ghost.y + randomDir.y,
          };
        })
      );
    }, speed);

    return () => clearInterval(timer);
  }, [dir, nextDir, level, gameOver, map]);

  useEffect(() => {
    ghosts.forEach((ghost) => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        if (isScared) {
          setScore((s) => s + 200);
          ghost.x = 9;
          ghost.y = 9;
        } else {
          setGameOver(true);
        }
      }
    });
  }, [pacman, ghosts, isScared]);

  const restartGame = () => {
    setMap(INITIAL_MAP);
    setPacman({ x: 9, y: 16 });
    setGhosts([
      { id: 1, x: 9, y: 9, color: 'bg-red-500' },
      { id: 2, x: 8, y: 10, color: 'bg-pink-400' },
      { id: 3, x: 10, y: 10, color: 'bg-cyan-400' },
    ]);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsScared(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-800">
      <div className="flex justify-between w-full max-w-[380px] mb-4 text-lg font-bold">
        <span>Score: <span className="text-yellow-400">{score}</span></span>
        <span>Level: <span className="text-blue-400">{level}</span></span>
      </div>

      <div className="relative border-4 border-blue-600 rounded-lg p-1 bg-black">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${map[0].length}, 18px)`,
            gridTemplateRows: `repeat(${map.length}, 18px)`,
          }}
        >
          {map.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isPacmanHere = pacman.x === cIdx && pacman.y === rIdx;
              const ghost = ghosts.find((g) => g.x === cIdx && g.y === rIdx);

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-[18px] h-[18px] flex items-center justify-center relative"
                >
                  {cell === 1 && <div className="w-full h-full bg-blue-900 border border-blue-700 rounded-sm" />}
                  {cell === 0 && <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full" />}
                  {cell === 3 && <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping" />}
                  {isPacmanHere && (
                    <div className="w-4 h-4 bg-yellow-400 rounded-full absolute z-10 shadow-md shadow-yellow-400/50" />
                  )}
                  {ghost && !isPacmanHere && (
                    <div
                      className={`w-4 h-4 rounded-t-full absolute z-10 ${
                        isScared ? 'bg-blue-500 animate-pulse' : ghost.color
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-lg">
            <h2 className="text-2xl font-black text-red-500">Game Over!</h2>
            <p className="text-sm">Final Score: {score}</p>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}