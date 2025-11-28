import { useState, useEffect, useMemo } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { PlayControls, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const formulas = [
  { latex: 'slope_{x-t} = v', description: 'Slope of position-time graph gives velocity' },
  { latex: 'slope_{v-t} = a', description: 'Slope of velocity-time graph gives acceleration' },
  { latex: 'area_{v-t} = \\Delta x', description: 'Area under velocity-time graph gives displacement' },
];

type MotionType = 'uniform' | 'accelerated' | 'freefall';

const KinematicsGraphs = () => {
  const [motionType, setMotionType] = useState<MotionType>('uniform');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const motionParams = useMemo(() => {
    switch (motionType) {
      case 'uniform':
        return { v0: 5, a: 0, label: 'Uniform Motion (constant velocity)' };
      case 'accelerated':
        return { v0: 0, a: 2, label: 'Uniformly Accelerated Motion' };
      case 'freefall':
        return { v0: 0, a: 9.8, label: 'Free Fall (g = 9.8 m/s²)' };
      default:
        return { v0: 5, a: 0, label: 'Uniform Motion' };
    }
  }, [motionType]);

  // Generate data points
  const data = useMemo(() => {
    const points = [];
    const maxTime = 5;
    for (let t = 0; t <= maxTime; t += 0.1) {
      const v = motionParams.v0 + motionParams.a * t;
      const x = motionParams.v0 * t + 0.5 * motionParams.a * t * t;
      points.push({
        t: parseFloat(t.toFixed(1)),
        x: parseFloat(x.toFixed(2)),
        v: parseFloat(v.toFixed(2)),
        a: motionParams.a,
      });
    }
    return points;
  }, [motionParams]);

  // Current values based on time
  const currentV = motionParams.v0 + motionParams.a * time;
  const currentX = motionParams.v0 * time + 0.5 * motionParams.a * time * time;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTime((t) => {
          if (t >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return t + 0.05;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const handleMotionChange = (type: MotionType) => {
    setMotionType(type);
    setTime(0);
    setIsPlaying(false);
  };

  return (
    <TopicLayout
      title="Kinematics Graphs"
      description="Motion graphs visually represent position, velocity, and acceleration over time. The slopes and areas reveal key relationships between these quantities."
      topicNumber={8}
      prevTopic={{ name: 'Relative Motion', path: '/topic/relative-motion' }}
    >
      <div className="space-y-6">
        {/* Motion Type Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'uniform' as MotionType, label: 'Uniform Motion' },
                { type: 'accelerated' as MotionType, label: 'Accelerated Motion' },
                { type: 'freefall' as MotionType, label: 'Free Fall' },
              ].map(({ type, label }) => (
                <Button
                  key={type}
                  variant={motionType === type ? 'default' : 'outline'}
                  onClick={() => handleMotionChange(type)}
                  className={motionType === type ? '' : 'border-primary/50 hover:bg-primary/20'}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{motionParams.label}</p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <PlayControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onReset={handleReset}
          />
          <div className="flex gap-4">
            <ValueDisplay label="Time" value={time.toFixed(2)} unit=" s" color="yellow" />
            <ValueDisplay label="Position" value={currentX.toFixed(1)} unit=" m" color="cyan" />
            <ValueDisplay label="Velocity" value={currentV.toFixed(1)} unit=" m/s" color="green" />
          </div>
        </div>

        {/* Graphs */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Position-Time Graph */}
          <Card className="card-hover">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Position vs Time (x-t)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 20%)" />
                    <XAxis 
                      dataKey="t" 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                      domain={[0, 5]}
                    />
                    <YAxis 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="x" 
                      stroke="hsl(190, 100%, 50%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine x={time} stroke="hsl(45, 100%, 50%)" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Slope = velocity: {motionType === 'uniform' ? 'constant' : 'increasing'}
              </p>
            </CardContent>
          </Card>

          {/* Velocity-Time Graph */}
          <Card className="card-hover">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Velocity vs Time (v-t)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 20%)" />
                    <XAxis 
                      dataKey="t" 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                      domain={[0, 5]}
                    />
                    <YAxis 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="v" 
                      stroke="hsl(150, 100%, 45%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine x={time} stroke="hsl(45, 100%, 50%)" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Slope = acceleration: {motionParams.a} m/s² | Area = displacement
              </p>
            </CardContent>
          </Card>

          {/* Acceleration-Time Graph */}
          <Card className="card-hover">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Acceleration vs Time (a-t)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 20%)" />
                    <XAxis 
                      dataKey="t" 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                      domain={[0, 5]}
                    />
                    <YAxis 
                      stroke="hsl(215, 20%, 65%)" 
                      tick={{ fontSize: 10 }}
                      domain={[0, 12]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="a" 
                      stroke="hsl(0, 100%, 60%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine x={time} stroke="hsl(45, 100%, 50%)" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Constant: {motionParams.a} m/s² | Area = change in velocity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulas */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard formulas={formulas} title="Graph Relationships" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Reading Graphs</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="text-cyan">x-t graph:</span> Curved line = changing velocity (acceleration)</p>
                <p><span className="text-green">v-t graph:</span> Straight line = constant acceleration</p>
                <p><span className="text-red">a-t graph:</span> Horizontal line = uniform acceleration</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default KinematicsGraphs;
