import { useState } from 'react';
import Logo from '../assets/screen.png';
import { FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'qwertyericG4387491') {
      setError('');
      onLogin(true);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src={Logo} alt="Linkpii" className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-400/50" />
          <span className="font-display text-xl font-bold">Linkpii</span>
        </div>
        <div className="relative">
          <h1 className="font-display text-3xl font-bold leading-tight">
            Admin Console
          </h1>
          <p className="mt-3 max-w-sm text-ink-300">
            Approve listings, manage users, and keep Ghana's marketplace running
            smoothly — all from one place.
          </p>
        </div>
        <p className="relative text-xs text-ink-500">
          &copy; {new Date().getFullYear()} Linkpii. Internal use only.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={Logo} alt="Linkpii" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl font-bold text-ink-900">Linkpii Admin</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-900">Welcome back</h2>
          <p className="mt-1 text-sm text-ink-500">Enter the admin password to continue.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-ink-200 bg-ink-50 py-3 pl-10 pr-3 text-sm text-ink-900 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
