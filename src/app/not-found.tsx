export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center h-screen 
                    bg-white dark:bg-[#0f0f12]"
    >
      <div className="text-center">
        <h1 className="text-7xl font-bold text-black dark:text-white">404</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Page not found</p>
      </div>
    </div>
  );
}
