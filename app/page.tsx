export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Статус-бейдж */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full bg-slate-900 border border-slate-800 text-slate-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Открыт к новым проектам
        </div>

        {/* Главный заголовок */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Привет, я начинающий Frontend-разработчик
        </h1>

        {/* Описание */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Разрабатываю современные интерактивные веб-приложения c использованием Next.js, React и Tailwind CSS.
        </p>

        {/* Кнопки переходов */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/projects"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Смотреть проекты
          </a>
          <a
            href="/contacts"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-medium text-slate-300 transition-all"
          >
            Связаться со мной
          </a>
        </div>
      </div>
    </main>
  );
}