import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const topics = [
  { id: 1, name: 'Scalars & Vectors', path: '/topic/scalars-vectors' },
  { id: 2, name: 'Distance & Displacement', path: '/topic/distance-displacement' },
  { id: 3, name: 'Speed & Velocity', path: '/topic/speed-velocity' },
  { id: 4, name: 'Acceleration', path: '/topic/acceleration' },
  { id: 5, name: 'Equations of Motion', path: '/topic/equations-of-motion' },
  { id: 6, name: 'Projectile Motion', path: '/topic/projectile-motion' },
  { id: 7, name: 'Relative Motion', path: '/topic/relative-motion' },
  { id: 8, name: 'Kinematics Graphs', path: '/topic/kinematics-graphs' },
];

export const TopNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gradient">Kinematics</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" size="sm" className={cn(
                "text-muted-foreground hover:text-primary",
                location.pathname === '/' && "text-primary"
              )}>
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
            {topics.slice(0, 4).map((topic) => (
              <Link key={topic.id} to={topic.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-muted-foreground hover:text-primary",
                    location.pathname === topic.path && "text-primary bg-primary/10"
                  )}
                >
                  {topic.name}
                </Button>
              </Link>
            ))}
            <Link to="/summary">
              <Button variant="ghost" size="sm" className={cn(
                "text-muted-foreground hover:text-primary",
                location.pathname === '/summary' && "text-primary"
              )}>
                Summary
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            {topics.map((topic) => (
              <Link key={topic.id} to={topic.path} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location.pathname === topic.path && "text-primary bg-primary/10"
                  )}
                >
                  <span className="w-6 text-primary/60 text-sm">{topic.id}.</span>
                  {topic.name}
                </Button>
              </Link>
            ))}
            <Link to="/summary" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Summary
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const SideTOC = () => {
  const location = useLocation();

  return (
    <aside className="hidden xl:block fixed left-4 top-24 w-56">
      <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-primary mb-3">Topics</h3>
        <nav className="space-y-1">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={topic.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200",
                location.pathname === topic.path
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                {topic.id}
              </span>
              <span className="truncate">{topic.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export const ProgressBar = () => {
  const location = useLocation();
  const currentIndex = topics.findIndex((t) => t.path === location.pathname);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / topics.length) * 100 : 0;

  if (currentIndex < 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted z-40">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export { topics };
