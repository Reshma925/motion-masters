import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TopicLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  prevTopic?: { name: string; path: string };
  nextTopic?: { name: string; path: string };
  topicNumber: number;
}

export const TopicLayout = ({
  title,
  description,
  children,
  prevTopic,
  nextTopic,
  topicNumber,
}: TopicLayoutProps) => {
  return (
    <div className="min-h-screen pb-20">
      {/* Topic Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            Topic {topicNumber}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {description}
        </p>
      </div>

      {/* Content */}
      <div className="animate-fade-in animation-delay-200">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
        {prevTopic ? (
          <Link to={prevTopic.path}>
            <Button variant="ghost" className="gap-2 hover:text-primary hover:bg-primary/10">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{prevTopic.name}</span>
              <span className="sm:hidden">Previous</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}
        
        {nextTopic ? (
          <Link to={nextTopic.path}>
            <Button variant="ghost" className="gap-2 hover:text-primary hover:bg-primary/10">
              <span className="hidden sm:inline">{nextTopic.name}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link to="/summary">
            <Button className="gap-2">
              View Summary
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
