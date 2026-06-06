import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingCart, Plus, LayoutDashboard, ClipboardList, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: '拼团大厅', icon: ShoppingCart },
  { to: '/create', label: '开团', icon: Plus },
  { to: '/dashboard', label: '团长后台', icon: LayoutDashboard },
  { to: '/orders', label: '我的订单', icon: ClipboardList },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xl">
            <ShoppingCart size={24} />
            奶粉拼团
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'text-gray-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto p-6 pt-24">
        <Outlet />
      </main>
    </div>
  );
}
