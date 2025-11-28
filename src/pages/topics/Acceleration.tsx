import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { PlayControls, SliderControl, ToggleControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: 'a = \\frac{\\Delta v}{\\Delta t}', description: 'Acceleration = change in velocity / change in time' },
  { latex: 'a = \\frac{v - u}{t}', description: 'Acceleration = (final velocity - initial velocity) / time' },
  { latex: 'a_{avg} = \\frac{v_f - v_i}{t_f - t_i}', description: 'Average acceleration over a time interval' },
];

const Acceleration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(60);
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(2);
  const [isDeceleration, setIsDeceleration] = useState(false);
  const animationRef = useRef<number>();

  const effectiveAccel = isDeceleration ? -acceleration : acceleration;

  useEffect(() => {
    if (isPlaying) {
      const dt = 0.016;
      const animate = () => {
        setVelocity((v) => {
          const newV = v + effectiveAccel * dt;
          // Clamp velocity
          if (isDeceleration && newV <= 0) return 0;
          if (!isDeceleration && newV >= 8) return 8;
          return newV;
        });
        setPosition((p) => {
          const newP = p + velocity * 3;
          if (newP >= 380) return 380;
          if (newP <= 60) return 60;
          return newP;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, effectiveAccel, velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const trackY = height / 2 + 20;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 8%)';
    ctx.fillRect(0, 0, width, height);

    // Draw track
    ctx.strokeStyle = 'hsl(240, 10%, 25%)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(50, trackY);
    ctx.lineTo(width - 40, trackY);
    ctx.stroke();

    // Draw car/ball
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 15;
    
    // Car body
    ctx.fillRect(position - 25, trackY - 20, 50, 15);
    ctx.fillRect(position - 15, trackY - 30, 30, 12);
    
    // Wheels
    ctx.fillStyle = 'hsl(240, 10%, 30%)';
    ctx.beginPath();
    ctx.arc(position - 15, trackY - 5, 8, 0, Math.PI * 2);
    ctx.arc(position + 15, trackY - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity vector (blue)
    const velArrowLength = velocity * 15;
    if (Math.abs(velArrowLength) > 5) {
      ctx.strokeStyle = 'hsl(190, 100%, 50%)';
      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(position + 30, trackY - 25);
      ctx.lineTo(position + 30 + velArrowLength, trackY - 25);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(position + 30 + velArrowLength, trackY - 25);
      ctx.lineTo(position + 20 + velArrowLength, trackY - 32);
      ctx.lineTo(position + 20 + velArrowLength, trackY - 18);
      ctx.closePath();
      ctx.fill();
    }

    // Acceleration vector (red)
    const accelArrowLength = effectiveAccel * 15;
    ctx.strokeStyle = 'hsl(0, 100%, 60%)';
    ctx.fillStyle = 'hsl(0, 100%, 60%)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(position, trackY - 50);
    ctx.lineTo(position + accelArrowLength, trackY - 50);
    ctx.stroke();

    // Arrow head
    if (Math.abs(accelArrowLength) > 5) {
      const dir = effectiveAccel > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(position + accelArrowLength, trackY - 50);
      ctx.lineTo(position + accelArrowLength - 10 * dir, trackY - 57);
      ctx.lineTo(position + accelArrowLength - 10 * dir, trackY - 43);
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, position + 35 + velArrowLength, trackY - 20);
    ctx.fillStyle = 'hsl(0, 100%, 60%)';
    ctx.fillText(`a = ${effectiveAccel.toFixed(1)} m/s²`, position + 5 + accelArrowLength, trackY - 55);

    // Legend
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.fillRect(20, 20, 15, 3);
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.fillText('Velocity', 40, 24);
    
    ctx.fillStyle = 'hsl(0, 100%, 60%)';
    ctx.fillRect(20, 35, 15, 3);
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.fillText('Acceleration', 40, 39);
  }, [position, velocity, effectiveAccel]);

  const handleReset = () => {
    setIsPlaying(false);
    setPosition(60);
    setVelocity(isDeceleration ? 5 : 0);
  };

  useEffect(() => {
    // Reset velocity when switching between accel/decel
    setVelocity(isDeceleration ? 5 : 0);
    setPosition(60);
  }, [isDeceleration]);

  return (
    <TopicLayout
      title="Acceleration"
      description="Acceleration is the rate of change of velocity. Positive acceleration speeds up, negative acceleration (deceleration) slows down."
      topicNumber={4}
      prevTopic={{ name: 'Speed & Velocity', path: '/topic/speed-velocity' }}
      nextTopic={{ name: 'Equations of Motion', path: '/topic/equations-of-motion' }}
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
                label="Acceleration Magnitude"
                value={acceleration}
                onChange={setAcceleration}
                min={0.5}
                max={5}
                step={0.5}
                unit=" m/s²"
              />
              <ToggleControl
                label="Deceleration Mode (negative a)"
                checked={isDeceleration}
                onCheckedChange={setIsDeceleration}
              />
              <div className="pt-2 border-t border-border space-y-1">
                <ValueDisplay label="Velocity" value={velocity} unit=" m/s" color="cyan" />
                <ValueDisplay label="Acceleration" value={effectiveAccel} unit=" m/s²" color="red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="Key Formulas" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Understanding Signs</h4>
              <p className="text-sm text-muted-foreground">
                <span className="text-red">Negative acceleration</span> doesn't always mean slowing down! It means acceleration in the negative direction. A car moving left that speeds up has negative acceleration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default Acceleration;
