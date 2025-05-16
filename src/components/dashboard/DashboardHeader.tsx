'use client';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function DashboardHeader({
  isSidebarOpen,
  setIsSidebarOpen,
}: DashboardHeaderProps) {
  return (
    <header className="md:hidden bg-white shadow p-4 flex justify-between items-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      <div className="w-6"></div>
    </header>
  );
} 