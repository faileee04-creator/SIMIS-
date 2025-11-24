import React, { ReactNode } from 'react';
import { LayoutDashboard, Inbox, Send, FileDigit, Menu, UserCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, role, setRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'incoming', label: 'Surat Masuk', icon: <Inbox size={20} /> },
    { id: 'outgoing', label: 'Surat Keluar', icon: <Send size={20} /> },
    { id: 'numbering', label: 'Penomoran Otomatis', icon: <FileDigit size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-primary text-white flex-shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider">SIMS APP</h1>
          ) : (
            <span className="font-bold text-xl">S</span>
          )}
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.id 
                      ? 'bg-accent text-white shadow-lg' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Role Toggle (For Demo Purposes) */}
        <div className="p-4 border-t border-gray-700">
          <button 
             onClick={() => setRole(role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN)}
             className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-800 text-sm text-gray-300"
          >
            <UserCircle size={24} />
            {isSidebarOpen && (
              <div className="text-left">
                <p className="font-semibold text-white">{role === UserRole.ADMIN ? 'Administrator' : 'User View'}</p>
                <p className="text-xs text-gray-500">Click to switch</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
             <Menu size={24} className="text-gray-600" />
          </button>
          <div className="text-gray-500 text-sm">
             {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
