function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:px-20 px-6 py-8 dark:bg-[#1e1e1e] bg-[#eeee]">
      {children}
    </div>
  );
}

export default Container;
