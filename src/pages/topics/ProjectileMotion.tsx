import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { PlayControls, SliderControl, ToggleControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: 'R = \\frac{u^2 \\sin 2\\theta}{g}', description: 'Range = (initial velocity² × sin(2×angle)) / gravity' },
  { latex: 'H = \\frac{u^2 \\sin^2 \\theta}{2g}', description: 'Max height = (initial velocity² × sin²(angle)) / (2×gravity)' },
  { latex: 'T = \\frac{2u \\sin \\theta}{g}', description: 'Time of flight = (2 × initial velocity × sin(angle)) / gravity' },
  { latex: 'v_x = u \\cos \\theta', description: 'Horizontal velocity component (constant)' },
  { latex: 'v_y = u \\sin \\theta - gt', description: 'Vertical velocity component (changes with time)' },
];

const ProjectileMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [initialSpeed, setInitialSpeed] = useState(50);
  const [angle, setAngle] = useState(45);
  const [showComponents, setShowComponents] = useState(false);
  const animationRef = useRef<number>();

  const g = 9.8;
  const radians = (angle * Math.PI) / 180;
  const vx = initialSpeed * Math.cos(radians);
  const vy0 = initialSpeed * Math.sin(radians);
  
  // Calculate trajectory values
  const timeOfFlight = (2 * vy0) / g;
  const range = vx * timeOfFlight;
  const maxHeight = (vy0 * vy0) / (2 * g);

  // Current position
  const x = vx * time;
  const y = vy0 * time - 0.5 * g * time * time;
  const vy = vy0 - g * time;

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((t) => {
          const next = t + 0.02;
          if (next >= timeOfFlight) {
            setIsPlaying(false);
            return timeOfFlight;
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
  }, [isPlaying, timeOfFlight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height - 40;
    const scale = Math.min((width - 80) / range, (height - 80) / maxHeight) * 0.8;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 8%)';
    ctx.fillRect(0, 0, width, height);

    // Draw ground
    ctx.strokeStyle = 'hsl(240, 10%, 25%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, groundY);
    ctx.lineTo(width - 20, groundY);
    ctx.stroke();

    // Draw trajectory path (dotted)
    ctx.strokeStyle = 'hsl(190, 100%, 30%)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= timeOfFlight; t += 0.05) {
      const px = 40 + vx * t * scale;
      const py = groundY - (vy0 * t - 0.5 * g * t * t) * scale;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw traveled path
    if (time > 0) {
      ctx.strokeStyle = 'hsl(190, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= time; t += 0.02) {
        const px = 40 + vx * t * scale;
        const py = groundY - (vy0 * t - 0.5 * g * t * t) * scale;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Current position
    const currentX = 40 + x * scale;
    const currentY = groundY - Math.max(0, y) * scale;

    // Draw components if enabled
    if (showComponents && time > 0 && time < timeOfFlight) {
      // Horizontal component
      ctx.strokeStyle = 'hsl(150, 100%, 45%)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX + vx * 0.5, currentY);
      ctx.stroke();
      
      // Vertical component
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX, currentY - vy * 0.5);
      ctx.stroke();

      // Labels
      ctx.font = '10px sans-serif';
      ctx.fillStyle = 'hsl(150, 100%, 45%)';
      ctx.fillText('vₓ', currentX + vx * 0.3, currentY + 15);
      ctx.fillStyle = 'hsl(45, 100%, 50%)';
      ctx.fillText('vᵧ', currentX - 20, currentY - vy * 0.3);
    }

    // Draw projectile
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Max height marker
    const maxHeightX = 40 + (range / 2) * scale;
    const maxHeightY = groundY - maxHeight * scale;
    ctx.strokeStyle = 'hsl(270, 100%, 60%)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(maxHeightX, groundY);
    ctx.lineTo(maxHeightX, maxHeightY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'hsl(270, 100%, 60%)';
    ctx.font = '10px sans-serif';
    ctx.fillText(`H = ${maxHeight.toFixed(1)}m`, maxHeightX + 5, maxHeightY + 10);

    // Range marker
    ctx.fillStyle = 'hsl(0, 100%, 60%)';
    ctx.fillText(`R = ${range.toFixed(1)}m`, 40 + range * scale - 30, groundY + 20);

    // Launch angle indicator
    ctx.strokeStyle = 'hsl(45, 100%, 50%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(40, groundY, 25, -radians, 0);
    ctx.stroke();
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.fillText(`${angle}°`, 55, groundY - 5);
  }, [time, initialSpeed, angle, showComponents, vx, vy0, timeOfFlight, range, maxHeight, x, y, vy]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <TopicLayout
      title="Projectile Motion"
      description="Projectile motion combines horizontal motion (constant velocity) with vertical motion (constant acceleration due to gravity)."
      topicNumber={6}
      prevTopic={{ name: 'Equations of Motion', path: '/topic/equations-of-motion' }}
      nextTopic={{ name: 'Relative Motion', path: '/topic/relative-motion' }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Interactive Simulation</h3>
            <canvas
              ref={canvasRef}
              width={420}
              height={280}
              className="w-full simulation-canvas mb-4"
            />
            <div className="space-y-4">
              <PlayControls
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={handleReset}
              />
              <SliderControl
                label="Initial Speed"
                value={initialSpeed}
                onChange={(v) => { setInitialSpeed(v); setTime(0); }}
                min={20}
                max={80}
                unit=" m/s"
              />
              <SliderControl
                label="Launch Angle"
                value={angle}
                onChange={(v) => { setAngle(v); setTime(0); }}
                min={10}
                max={80}
                unit="°"
              />
              <ToggleControl
                label="Show velocity components"
                checked={showComponents}
                onCheckedChange={setShowComponents}
              />
              <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
                <ValueDisplay label="Range" value={range.toFixed(1)} unit=" m" color="red" />
                <ValueDisplay label="Max Height" value={maxHeight.toFixed(1)} unit=" m" color="purple" />
                <ValueDisplay label="Flight Time" value={timeOfFlight.toFixed(2)} unit=" s" color="yellow" />
                <ValueDisplay label="Current t" value={time.toFixed(2)} unit=" s" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="Key Formulas" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Key Insight</h4>
              <p className="text-sm text-muted-foreground">
                At <span className="text-yellow">45°</span>, range is maximum for a given speed. The horizontal and vertical components are independent—gravity only affects vertical motion!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default ProjectileMotion;
