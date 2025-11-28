import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { PlayControls, SliderControl, ToggleControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const formulas = [
  { latex: 'v = \\frac{\\Delta x}{\\Delta t}', description: 'Velocity = change in position / change in time' },
  { latex: 'speed = \\frac{distance}{time}', description: 'Speed = total distance / total time' },
  { latex: '\\vec{v}_{avg} = \\frac{\\vec{s}}{t}', description: 'Average velocity = displacement / time' },
];

const SpeedVelocity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(50);
  const [speed, setSpeed] = useState(2);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [showVelocity, setShowVelocity] = useState(true);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setPosition((prev) => {
          const next = prev + speed * direction;
          if (next >= 380 || next <= 50) {
            return prev;
          }
          return next;
        });
        setTime((prev) => prev + 0.016);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed, direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const trackY = height / 2;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 8%)';
    ctx.fillRect(0, 0, width, height);

    // Draw track
    ctx.strokeStyle = 'hsl(240, 10%, 25%)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, trackY);
    ctx.lineTo(width - 40, trackY);
    ctx.stroke();

    // Track markers
    ctx.fillStyle = 'hsl(215, 20%, 40%)';
    ctx.font = '10px sans-serif';
    for (let i = 0; i <= 10; i++) {
      const x = 50 + (i * 33);
      ctx.beginPath();
      ctx.moveTo(x, trackY - 8);
      ctx.lineTo(x, trackY + 8);
      ctx.stroke();
      ctx.fillText(`${i * 10}m`, x - 8, trackY + 25);
    }

    // Draw object
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(position, trackY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw velocity vector or speed indicator
    if (showVelocity) {
      // Velocity arrow
      const arrowLength = speed * 25 * direction;
      ctx.strokeStyle = 'hsl(190, 100%, 50%)';
      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(position, trackY - 35);
      ctx.lineTo(position + arrowLength, trackY - 35);
      ctx.stroke();

      // Arrow head
      if (Math.abs(arrowLength) > 10) {
        const headDir = direction;
        ctx.beginPath();
        ctx.moveTo(position + arrowLength, trackY - 35);
        ctx.lineTo(position + arrowLength - 10 * headDir, trackY - 45);
        ctx.lineTo(position + arrowLength - 10 * headDir, trackY - 25);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`v = ${(speed * direction).toFixed(1)} m/s`, position - 25, trackY - 55);
    } else {
      // Speed (scalar) - just number
      ctx.fillStyle = 'hsl(45, 100%, 50%)';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${speed.toFixed(1)} m/s`, position - 25, trackY - 40);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'hsl(215, 20%, 65%)';
      ctx.fillText('(speed - no direction)', position - 45, trackY - 55);
    }

    // Labels
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.font = '12px sans-serif';
    ctx.fillText('← Left', 50, 30);
    ctx.fillText('Right →', width - 90, 30);
  }, [position, speed, direction, showVelocity]);

  const handleReset = () => {
    setIsPlaying(false);
    setPosition(50);
    setTime(0);
  };

  const toggleDirection = () => {
    setDirection((d) => d * -1);
  };

  return (
    <TopicLayout
      title="Speed & Velocity"
      description="Speed is how fast an object moves (scalar). Velocity includes both speed and direction (vector)."
      topicNumber={3}
      prevTopic={{ name: 'Distance & Displacement', path: '/topic/distance-displacement' }}
      nextTopic={{ name: 'Acceleration', path: '/topic/acceleration' }}
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
              <div className="flex items-center justify-between">
                <PlayControls
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onReset={handleReset}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDirection}
                  className="border-primary/50 hover:bg-primary/20"
                >
                  Flip Direction
                </Button>
              </div>
              <SliderControl
                label="Speed"
                value={speed}
                onChange={setSpeed}
                min={0.5}
                max={5}
                step={0.5}
                unit=" m/s"
              />
              <ToggleControl
                label="Show Velocity Vector (vs Speed)"
                checked={showVelocity}
                onCheckedChange={setShowVelocity}
              />
              <div className="pt-2 border-t border-border space-y-1">
                <ValueDisplay label="Speed (scalar)" value={speed} unit=" m/s" color="yellow" />
                <ValueDisplay label="Velocity (vector)" value={speed * direction} unit=" m/s" color="cyan" />
                <ValueDisplay label="Direction" value={direction > 0 ? 'Right (+)' : 'Left (-)'} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="Key Formulas" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Key Difference</h4>
              <p className="text-sm text-muted-foreground">
                A car going <span className="text-yellow">60 km/h</span> has the same speed whether going north or south. But its <span className="text-cyan">velocity</span> is different: +60 km/h north vs -60 km/h (or 60 km/h south).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default SpeedVelocity;
