import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { PlayControls, SliderControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: 's = x_f - x_i', description: 'Displacement = final position - initial position' },
  { latex: 'd = \\sum |\\Delta x|', description: 'Distance = sum of all path lengths traveled' },
  { latex: '|\\vec{s}| \\leq d', description: 'Displacement magnitude is always ≤ distance' },
];

const DistanceDisplacement = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number>();

  // Path points (curved path)
  const pathPoints = [
    { x: 50, y: 200 },
    { x: 100, y: 100 },
    { x: 180, y: 150 },
    { x: 250, y: 80 },
    { x: 320, y: 120 },
    { x: 380, y: 200 },
  ];

  const getPointOnPath = (t: number) => {
    const totalSegments = pathPoints.length - 1;
    const segmentProgress = t * totalSegments;
    const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
    const localT = segmentProgress - segmentIndex;
    
    const p1 = pathPoints[segmentIndex];
    const p2 = pathPoints[segmentIndex + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * localT,
      y: p1.y + (p2.y - p1.y) * localT,
    };
  };

  const calculateDistance = (t: number) => {
    let distance = 0;
    const steps = Math.floor(t * 100);
    for (let i = 1; i <= steps; i++) {
      const prev = getPointOnPath((i - 1) / 100);
      const curr = getPointOnPath(i / 100);
      distance += Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
    }
    return distance;
  };

  const calculateDisplacement = (t: number) => {
    const start = pathPoints[0];
    const current = getPointOnPath(t);
    return Math.sqrt((current.x - start.x) ** 2 + (current.y - start.y) ** 2);
  };

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress((prev) => {
          const next = prev + 0.005 * speed;
          if (next >= 1) {
            setIsPlaying(false);
            return 1;
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
  }, [isPlaying, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 8%)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'hsl(240, 10%, 15%)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw curved path (distance)
    ctx.strokeStyle = 'hsl(45, 100%, 50%)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    for (let i = 1; i < pathPoints.length; i++) {
      ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw traveled path
    if (progress > 0) {
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const start = pathPoints[0];
      ctx.moveTo(start.x, start.y);
      for (let t = 0; t <= progress; t += 0.01) {
        const point = getPointOnPath(t);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    // Draw displacement arrow
    const currentPos = getPointOnPath(progress);
    ctx.strokeStyle = 'hsl(190, 100%, 50%)';
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.lineWidth = 3;
    
    const startPoint = pathPoints[0];
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    // Arrow head
    if (progress > 0.05) {
      const angle = Math.atan2(currentPos.y - startPoint.y, currentPos.x - startPoint.x);
      const headLength = 12;
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y);
      ctx.lineTo(
        currentPos.x - headLength * Math.cos(angle - Math.PI / 6),
        currentPos.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        currentPos.x - headLength * Math.cos(angle + Math.PI / 6),
        currentPos.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }

    // Draw moving object
    ctx.fillStyle = 'hsl(190, 100%, 60%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Start point
    ctx.fillStyle = 'hsl(150, 100%, 45%)';
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Start', startPoint.x - 15, startPoint.y + 25);
    
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.fillText('Distance (path)', 150, 60);
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.fillText('Displacement (straight)', 150, 250);
  }, [progress]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <TopicLayout
      title="Distance & Displacement"
      description="Distance is the total path length traveled (scalar). Displacement is the straight-line change in position (vector)."
      topicNumber={2}
      prevTopic={{ name: 'Scalars & Vectors', path: '/topic/scalars-vectors' }}
      nextTopic={{ name: 'Speed & Velocity', path: '/topic/speed-velocity' }}
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
              <div className="flex items-center justify-between">
                <PlayControls
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onReset={handleReset}
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress * 100)}% complete
                </span>
              </div>
              <SliderControl
                label="Speed"
                value={speed}
                onChange={setSpeed}
                min={0.5}
                max={3}
                step={0.5}
                unit="x"
              />
              <div className="pt-2 border-t border-border space-y-1">
                <ValueDisplay label="Distance" value={calculateDistance(progress).toFixed(0)} unit=" units" color="yellow" />
                <ValueDisplay label="Displacement" value={calculateDisplacement(progress).toFixed(0)} unit=" units" color="cyan" />
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
                When you walk around a track and return to your starting point, your <span className="text-yellow">distance</span> is the track length, but your <span className="text-cyan">displacement</span> is zero!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default DistanceDisplacement;
