import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard, Formula } from '@/components/kinematics/Formula';
import { PlayControls, SliderControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: 'v = u + at', description: 'Final velocity = initial velocity + (acceleration × time)' },
  { latex: 's = ut + \\frac{1}{2}at^2', description: 'Displacement = (initial velocity × time) + ½(acceleration × time²)' },
  { latex: 'v^2 = u^2 + 2as', description: 'Final velocity² = initial velocity² + 2(acceleration × displacement)' },
  { latex: 's = \\frac{(u + v)}{2} \\times t', description: 'Displacement = average velocity × time' },
];

const EquationsOfMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [initialVelocity, setInitialVelocity] = useState(2);
  const [acceleration, setAcceleration] = useState(1);
  const animationRef = useRef<number>();

  // Calculate values using SUVAT
  const currentVelocity = initialVelocity + acceleration * time;
  const displacement = initialVelocity * time + 0.5 * acceleration * time * time;

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((t) => {
          const next = t + 0.02;
          if (next >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const trackY = height - 50;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 8%)';
    ctx.fillRect(0, 0, width, height);

    // Draw track
    ctx.strokeStyle = 'hsl(240, 10%, 25%)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, trackY);
    ctx.lineTo(width - 20, trackY);
    ctx.stroke();

    // Track markers
    ctx.fillStyle = 'hsl(215, 20%, 40%)';
    ctx.font = '10px sans-serif';
    for (let i = 0; i <= 8; i++) {
      const x = 40 + (i * 45);
      ctx.beginPath();
      ctx.moveTo(x, trackY - 5);
      ctx.lineTo(x, trackY + 5);
      ctx.stroke();
      ctx.fillText(`${i * 5}m`, x - 8, trackY + 18);
    }

    // Calculate position on canvas
    const posX = 40 + (displacement * 9);
    const clampedX = Math.max(40, Math.min(posX, width - 40));

    // Draw object
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(clampedX, trackY - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Start marker
    ctx.fillStyle = 'hsl(150, 100%, 45%)';
    ctx.beginPath();
    ctx.arc(40, trackY - 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Active formula highlight
    ctx.fillStyle = 'hsl(240, 10%, 12%)';
    ctx.fillRect(20, 15, width - 40, 80);
    ctx.strokeStyle = 'hsl(190, 100%, 50%)';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 15, width - 40, 80);

    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Current calculation using: v = u + at', 30, 35);
    
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.font = '14px monospace';
    ctx.fillText(`v = ${initialVelocity.toFixed(1)} + (${acceleration.toFixed(1)} × ${time.toFixed(2)})`, 30, 55);
    ctx.fillText(`v = ${currentVelocity.toFixed(2)} m/s`, 30, 75);

    // Time indicator
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.font = '14px sans-serif';
    ctx.fillText(`t = ${time.toFixed(2)}s`, width - 80, 35);
  }, [time, initialVelocity, acceleration, currentVelocity, displacement]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <TopicLayout
      title="Equations of Motion (SUVAT)"
      description="The SUVAT equations relate displacement (s), initial velocity (u), final velocity (v), acceleration (a), and time (t) for uniformly accelerated motion."
      topicNumber={5}
      prevTopic={{ name: 'Acceleration', path: '/topic/acceleration' }}
      nextTopic={{ name: 'Projectile Motion', path: '/topic/projectile-motion' }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Interactive Simulation</h3>
            <canvas
              ref={canvasRef}
              width={420}
              height={200}
              className="w-full simulation-canvas mb-4"
            />
            <div className="space-y-4">
              <PlayControls
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={handleReset}
              />
              <SliderControl
                label="Initial Velocity (u)"
                value={initialVelocity}
                onChange={setInitialVelocity}
                min={0}
                max={5}
                step={0.5}
                unit=" m/s"
              />
              <SliderControl
                label="Acceleration (a)"
                value={acceleration}
                onChange={setAcceleration}
                min={0}
                max={3}
                step={0.5}
                unit=" m/s²"
              />
              <div className="pt-2 border-t border-border space-y-1">
                <ValueDisplay label="Time (t)" value={time} unit=" s" color="yellow" />
                <ValueDisplay label="Velocity (v)" value={currentVelocity} unit=" m/s" color="cyan" />
                <ValueDisplay label="Displacement (s)" value={displacement} unit=" m" color="green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="SUVAT Equations" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Variable Guide</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-primary font-mono">s</span> = Displacement</div>
                <div><span className="text-primary font-mono">u</span> = Initial velocity</div>
                <div><span className="text-primary font-mono">v</span> = Final velocity</div>
                <div><span className="text-primary font-mono">a</span> = Acceleration</div>
                <div><span className="text-primary font-mono">t</span> = Time</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default EquationsOfMotion;
