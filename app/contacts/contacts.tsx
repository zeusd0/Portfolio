export default function ContactsPage() {
  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Связаться со мной</h1>
        <p className="text-gray-600 dark:text-gray-400">Готов к сотрудничеству и интересным предложениям!</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="font-semibold text-gray-700 dark:text-gray-300">GitHub:</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            github.com/Zeusd0
          </a>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Telegram:</span>
          <a href="https://t.me" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            @zeusd0
          </a>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
          <a href="mailto:example@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            portn0v@yandex.ru
          </a>
        </div>
      </div>
    </div>
  );
}