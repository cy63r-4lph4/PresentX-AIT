const NoEvent = () => {
  return (
    <div className="col-span-5 flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
      <svg
        className="w-16 h-16 text-indigo-500 mb-4 animate-pulse"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
        />
      </svg>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        No Events Scheduled
      </h2>
      <p className="text-md text-gray-500 dark:text-gray-400">
        You're all clear for this week. Enjoy your free time!
      </p>
    </div>
  );
};

export default NoEvent;
