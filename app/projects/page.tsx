'use client';

import React, { useState } from 'react';
import SnakeGame from '@/components/SnakeGame';
import TetrisGame from '@/components/TetrisGame';
import TanksGame from '@/components/TanksGame';

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState<'snake' | 'tetris' | 'tanks' | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Мои <span className="text-emerald-400">Проекты</span>
        </h1>
        <p className="text-gray-400">
          Выберите играбельный проект из списка ниже:
        </p>
      </div>

      {/* Каталог выбора проектов */}
      {!activeProject && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Карточка Змейки */}
          <div
            onClick={() => setActiveProject('snake')}
            className="group cursor-pointer p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-4">🐍</div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                Змейка
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Собирайте еду и расти!
              </p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 font-semibold rounded-xl transition">
              Играть
            </button>
          </div>

          {/* Карточка Тетриса */}
          <div
            onClick={() => setActiveProject('tetris')}
            className="group cursor-pointer p-6 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-4">🧱</div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                Тетрис
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Классический тетрис
              </p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 font-semibold rounded-xl transition">
              Играть
            </button>
          </div>

          {/* Карточка Танчиков */}
          <div
            onClick={() => setActiveProject('tanks')}
            className="group cursor-pointer p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">
                Танчики
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Что-то похожее на танки
              </p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 font-semibold rounded-xl transition">
              Играть
            </button>
          </div>
        </div>
      )}

      {/* Окно с выбранной игрой */}
      {activeProject && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setActiveProject(null)}
            className="mb-6 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition text-sm flex items-center gap-2 cursor-pointer"
          >
            ← Назад к каталогу проектов
          </button>

          {activeProject === 'snake' && <SnakeGame />}
          {activeProject === 'tetris' && <TetrisGame />}
          {activeProject === 'tanks' && <TanksGame />}
        </div>
      )}
    </main>
  );
}