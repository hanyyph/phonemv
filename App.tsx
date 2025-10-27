import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import AdminDashboard from './components/admin/AdminDashboard';
import UserView from './components/user/UserView';
import LoginPage from './components/admin/LoginPage';
import { Sun, Moon, Shield, Smartphone, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleToggleView = () => {
    setIsAdminView(!isAdminView);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminView(false); // Switch back to user view on logout
  };

  const renderMainContent = () => {
    if (isAdminView) {
      if (isAuthenticated) {
        return <AdminDashboard />;
      }
      return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }
    return <UserView />;
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-slate-700/50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Smartphone className="h-8 w-8 text-indigo-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PhonePrice</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors">
                  {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
                
                <button onClick={handleToggleView} className="flex items-center px-3 py-2 sm:px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">{isAdminView ? 'User View' : 'Admin Panel'}</span>
                </button>
                
                {isAuthenticated && isAdminView && (
                  <button onClick={handleLogout} className="flex items-center px-3 py-2 sm:px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 transition-colors">
                    <LogOut className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}

              </div>
            </div>
          </nav>
        </header>
        <main>
          {renderMainContent()}
        </main>
      </div>
    </DataProvider>
  );
};

export default App;