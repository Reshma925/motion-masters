import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainLayout } from '@/components/kinematics/MainLayout';

const topics = [
  { id: 1, name: 'Scalars & Vectors', path: '/topic/scalars-vectors', desc: 'Magnitude vs direction' },
  { id: 2, name: 'Distance & Displacement', path: '/topic/distance-displacement', desc: 'Path vs straight line' },
  { id: 3, name: 'Speed & Velocity', path: '/topic/speed-velocity', desc: 'Scalar vs vector motion' },
  { id: 4, name: 'Acceleration', path: '/topic/acceleration', desc: 'Rate of velocity change' },
  { id: 5, name: 'Equations of Motion', path: '/topic/equations-of-motion', desc: 'SUVAT formulas' },
  { id: 6, name: 'Projectile Motion', path: '/topic/projectile-motion', desc: '2D motion under gravity' },
  { id: 7, name: 'Relative Motion', path: '/topic/relative-motion', desc: 'Reference frames' },
  { id: 8, name: 'Kinematics Graphs', path: '/topic/kinematics-graphs', desc: 'x-t, v-t, a-t graphs' },
];

const Index = () => {
  return (
    <MainLayout showSideTOC={false}>
      <div className="py-8 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <Zap className="w-4 h-4" />
            Interactive Physics Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Kinematics
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Master the fundamentals of motion through interactive simulations and visual learning. Designed for 11th–12th grade students.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Link to="/topic/scalars-vectors">
              <Button size="lg" className="gap-2">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/summary">
              <Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
                <BookOpen className="w-4 h-4" /> View Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 animate-fade-in animation-delay-200">
          {[
            { icon: Target, title: 'Interactive', desc: 'Hands-on simulations for every topic' },
            { icon: BookOpen, title: 'Simple', desc: 'Clear definitions and key formulas' },
            { icon: Zap, title: 'Visual', desc: 'See physics concepts in action' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card/50 border-border/50">
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="space-y-4 animate-fade-in animation-delay-300">
          <h2 className="text-2xl font-semibold text-center">8 Core Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic) => (
              <Link key={topic.id} to={topic.path}>
                <Card className="card-hover h-full bg-card/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                        {topic.id}
                      </span>
                      <div>
                        <h3 className="font-medium text-sm">{topic.name}</h3>
                        <p className="text-xs text-muted-foreground">{topic.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
