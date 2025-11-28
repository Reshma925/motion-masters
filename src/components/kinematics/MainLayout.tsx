import { ReactNode } from 'react';
import { TopNav, SideTOC, ProgressBar } from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
  showSideTOC?: boolean;
}

export const MainLayout = ({ children, showSideTOC = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <ProgressBar />
      
      <div className="pt-20 pb-8">
        {showSideTOC && <SideTOC />}
        <main className={showSideTOC ? "xl:ml-64 xl:mr-8" : ""}>
          <div className="container mx-auto px-4 max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
