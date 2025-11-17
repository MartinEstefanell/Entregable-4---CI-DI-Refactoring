import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ListMusic,
  MonitorPlay,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Visualizador', path: '/viewer', icon: MonitorPlay },
  { name: 'Main Page', path: '/main', icon: HomeIcon },
  { name: 'My List', path: '/my-list', icon: ListMusic },
];

export default function NavBar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(NAV_ITEMS[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPath = location.pathname;
  useEffect(() => {
    const match = NAV_ITEMS.find((item) =>
      currentPath.startsWith(item.path),
    );
    if (match) {
      setActiveTab(match.name);
    }
  }, [currentPath]);

  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        isActive: activeTab === item.name,
      })),
    [activeTab],
  );

  return (
    <div className="fixed left-1/2 top-4 z-50 w-full max-w-xl -translate-x-1/2 px-4 sm:top-8">
      <div className="mx-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-1 py-1 backdrop-blur-xl shadow-glow">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActiveTab(item.name)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                item.isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className={isMobile ? 'sr-only' : undefined}>
                {item.name}
              </span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {item.isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 -z-10 rounded-full bg-white/10"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-brand">
                    <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-brand/40 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-brand/30 blur-md" />
                    <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-brand/40 blur-sm" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
