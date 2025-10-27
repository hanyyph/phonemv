import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demonstration purposes.
    if (username === 'admin' && password === 'password') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. (Hint: admin/password)');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Reset after animation duration
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-slate-900 p-4">
      <div className={`w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-slate-800 mx-4 ${isShaking ? 'animate-shake' : ''}`}>
        <div className="flex flex-col items-center">
            <Shield className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-2">Admin Panel Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</p>}
          <div>
            <label htmlFor="username" className={labelClasses}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClasses}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClasses}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;