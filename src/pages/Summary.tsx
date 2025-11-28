import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/kinematics/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Formula } from '@/components/kinematics/Formula';
import { Play } from 'lucide-react';

const topicSummaries = [
  {
    id: 1, name: 'Scalars & Vectors', path: '/topic/scalars-vectors',
    def: 'Scalars have magnitude only; vectors have magnitude and direction.',
    formulas: ['\\vec{A} = |A| \\hat{a}', '|\\vec{A}| = \\sqrt{A_x^2 + A_y^2}'],
  },
  {
    id: 2, name: 'Distance & Displacement', path: '/topic/distance-displacement',
    def: 'Distance is total path length; displacement is straight-line change in position.',
    formulas: ['s = x_f - x_i', 'd = \\sum |\\Delta x|'],
  },
  {
    id: 3, name: 'Speed & Velocity', path: '/topic/speed-velocity',
    def: 'Speed is rate of distance; velocity is rate of displacement (includes direction).',
    formulas: ['v = \\frac{\\Delta x}{\\Delta t}', 'speed = \\frac{d}{t}'],
  },
  {
    id: 4, name: 'Acceleration', path: '/topic/acceleration',
    def: 'Rate of change of velocity. Can be positive (speeding up) or negative (slowing down).',
    formulas: ['a = \\frac{\\Delta v}{\\Delta t}', 'a = \\frac{v - u}{t}'],
  },
  {
    id: 5, name: 'Equations of Motion', path: '/topic/equations-of-motion',
    def: 'SUVAT equations relate s, u, v, a, t for uniformly accelerated motion.',
    formulas: ['v = u + at', 's = ut + \\frac{1}{2}at^2', 'v^2 = u^2 + 2as'],
  },
  {
    id: 6, name: 'Projectile Motion', path: '/topic/projectile-motion',
    def: '2D motion under gravity with constant horizontal velocity and vertical acceleration.',
    formulas: ['R = \\frac{u^2 \\sin 2\\theta}{g}', 'H = \\frac{u^2 \\sin^2 \\theta}{2g}'],
  },
  {
    id: 7, name: 'Relative Motion', path: '/topic/relative-motion',
    def: 'Motion observed from different reference frames. Velocities are relative.',
    formulas: ['\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B'],
  },
  {
    id: 8, name: 'Kinematics Graphs', path: '/topic/kinematics-graphs',
    def: 'Graphs show position, velocity, acceleration vs time. Slopes and areas reveal relationships.',
    formulas: ['slope_{x-t} = v', 'slope_{v-t} = a', 'area_{v-t} = \\Delta x'],
  },
];

const Summary = () => {
  return (
    <MainLayout showSideTOC={false}>
      <div className="py-8 space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient">Summary & Revision</h1>
          <p className="text-muted-foreground">Quick reference for all kinematics topics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {topicSummaries.map((topic, index) => (
            <Card 
              key={topic.id} 
              className="card-hover animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {topic.id}
                    </span>
                    <h3 className="font-semibold">{topic.name}</h3>
                  </div>
                  <Link to={topic.path}>
                    <Button size="sm" variant="ghost" className="gap-1 text-primary hover:bg-primary/10">
                      <Play className="w-3 h-3" /> Try
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">{topic.def}</p>
                <div className="flex flex-wrap gap-2">
                  {topic.formulas.map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-muted/50 rounded text-sm">
                      <Formula latex={f} />
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Summary;
