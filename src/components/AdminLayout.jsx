import { useState } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import AppSidebar from './AppSidebar';

const AdminLayout = ({ children, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50">
      <AppSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <p className="font-display text-sm font-semibold text-ink-500 lg:hidden">
            Linkpii Admin
          </p>
          <button
            onClick={onLogout}
            className="ml-auto flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
