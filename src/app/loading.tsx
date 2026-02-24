export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden 
                    bg-white dark:bg-black transition-colors duration-300"
    >
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20
                      bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-400
                      dark:from-purple-600 dark:via-blue-600 dark:to-cyan-500
                      animate-pulse"
      />

      <div
        className="relative flex flex-col items-center gap-6 px-10 py-8 rounded-2xl 
                      bg-white/60 dark:bg-white/5 
                      backdrop-blur-xl 
                      border border-gray-200 dark:border-white/10 
                      shadow-xl"
      >
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:-0.3s]" />
          <span className="h-3 w-3 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:-0.15s]" />
          <span className="h-3 w-3 rounded-full bg-black dark:bg-white animate-bounce" />
        </div>

        <p
          className="text-sm tracking-widest uppercase 
                      text-gray-500 dark:text-gray-400"
        >
          Loading
        </p>
      </div>
    </div>
  );
}
