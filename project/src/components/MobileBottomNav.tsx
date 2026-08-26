import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, ShoppingBag, Sun, User, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  const currentPath = location.pathname;

  // Don't show on admin panel or print pages
  if (currentPath.startsWith('/admin') || currentPath.startsWith('/master-portal') || currentPath.includes('/print')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Daily Vibe', path: '/daily-forecast', icon: Sun },
    { label: 'Atelier', path: '/shop', icon: ShoppingBag, badge: totalItems > 0 ? totalItems : undefined },
    { label: 'Dashboard', path: '/dashboard', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080314]/90 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-amber-400 font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-amber-400 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[9px] flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
