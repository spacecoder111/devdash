import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import GitHubWidget from './GitHubWidget';
import SystemWidget from './SystemWidget';
import FocusWidget from './FocusWidget';

const API_URL = 'http://localhost:5000';

function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const { data: githubData, isLoading: githubLoading, error: githubError } = useQuery({
    queryKey: ['github'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/github`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 60000
  });

  const { data: systemData } = useQuery({
    queryKey: ['system'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/system`);
      return res.json();
    },
    refetchInterval: 30000
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            🚀 DevDash
          </h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GitHubWidget data={githubData} loading={githubLoading} error={githubError} />
          <SystemWidget data={systemData} />
          <FocusWidget />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;