import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { SliderControl, ToggleControl, ValueDisplay, PlayControls } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: '\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B', description: 'Velocity of A relative to B = velocity of A minus velocity of B' },
  { latex: '\\vec{v}_{BA} = -\\vec{v}_{AB}', description: 'Velocity of B relative to A is opposite to A relative to B' },
  { latex: '\\vec{v}_{AC} = \\vec{v}_{AB} + \\vec{v}_{BC}', description: 'Relative velocities can be added (chain rule)' },
];

const RelativeMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [velocityA, setVelocityA] = useState(4);
  const [velocityB, setVelocityB] = useState(2);
  const [positionA, setPositionA] = useState(50);
  const [positionB, setPositionB] = useState(50);
  const [referenceFrame, setReferenceFrame] = useState<'ground' | 'A' | 'B'>('ground');
  const animationRef = useRef<number>();

  const relativeVelocityAB = velocityA - velocityB;
  const relativeVelocityBA = velocityB - velocityA;

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setPositionA((p) => {
          const next = p + velocityA * 0.5;
          if (next >= 380) return 50;
          return next;
        });
        setPositionB((p) => {
          const next = p + velocityB * 0.5;
          if (next >= 380) return 50;
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, velocityA, velocityB]);

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

    // Calculate display positions based on reference frame
    let displayPosA = positionA;
    let displayPosB = positionB;
    let displayVelA = velocityA;
    let displayVelB = velocityB;

    if (referenceFrame === 'A') {
      displayPosA = width / 2;
      displayPosB = width / 2 + (positionB - positionA);
      displayVelA = 0;
      displayVelB = relativeVelocityBA;
    } else if (referenceFrame === 'B') {
      displayPosB = width / 2;
      displayPosA = width / 2 + (positionA - positionB);
      displayVelB = 0;
      displayVelA = relativeVelocityAB;
    }

    // Draw tracks
    const trackYA = 100;
    const trackYB = 180;

    ctx.strokeStyle = 'hsl(240, 10%, 25%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, trackYA);
    ctx.lineTo(width - 20, trackYA);
    ctx.moveTo(30, trackYB);
    ctx.lineTo(width - 20, trackYB);
    ctx.stroke();

    // Draw object A
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.shadowColor = 'hsl(190, 100%, 50%)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(displayPosA, trackYA, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity vector A
    if (Math.abs(displayVelA) > 0.1) {
      const arrowLen = displayVelA * 15;
      ctx.strokeStyle = 'hsl(190, 100%, 50%)';
      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(displayPosA + 20, trackYA);
      ctx.lineTo(displayPosA + 20 + arrowLen, trackYA);
      ctx.stroke();

      // Arrow head
      const dir = displayVelA > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(displayPosA + 20 + arrowLen, trackYA);
      ctx.lineTo(displayPosA + 10 + arrowLen, trackYA - 7);
      ctx.lineTo(displayPosA + 10 + arrowLen, trackYA + 7);
      ctx.closePath();
      ctx.fill();
    }

    // Draw object B
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.shadowColor = 'hsl(45, 100%, 50%)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(displayPosB, trackYB, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity vector B
    if (Math.abs(displayVelB) > 0.1) {
      const arrowLen = displayVelB * 15;
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.fillStyle = 'hsl(45, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(displayPosB + 20, trackYB);
      ctx.lineTo(displayPosB + 20 + arrowLen, trackYB);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(displayPosB + 20 + arrowLen, trackYB);
      ctx.lineTo(displayPosB + 10 + arrowLen, trackYB - 7);
      ctx.lineTo(displayPosB + 10 + arrowLen, trackYB + 7);
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.fillText(`Object A: v = ${displayVelA.toFixed(1)} m/s`, 30, trackYA - 25);
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.fillText(`Object B: v = ${displayVelB.toFixed(1)} m/s`, 30, trackYB - 25);

    // Reference frame indicator
    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Reference Frame: ${referenceFrame === 'ground' ? 'Ground' : `Object ${referenceFrame}`}`, 30, 30);

    // Vector diagram
    ctx.fillStyle = 'hsl(215, 20%, 40%)';
    ctx.fillRect(30, 220, 200, 70);
    ctx.strokeStyle = 'hsl(240, 10%, 30%)';
    ctx.strokeRect(30, 220, 200, 70);

    ctx.fillStyle = 'hsl(210, 40%, 98%)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Relative Velocity:', 40, 240);
    ctx.fillStyle = 'hsl(190, 100%, 50%)';
    ctx.fillText(`v_AB = ${relativeVelocityAB.toFixed(1)} m/s`, 40, 260);
    ctx.fillStyle = 'hsl(45, 100%, 50%)';
    ctx.fillText(`v_BA = ${relativeVelocityBA.toFixed(1)} m/s`, 40, 280);
  }, [positionA, positionB, velocityA, velocityB, referenceFrame, relativeVelocityAB, relativeVelocityBA]);

  const handleReset = () => {
    setIsPlaying(false);
    setPositionA(50);
    setPositionB(50);
  };

  return (
    <TopicLayout
      title="Relative Motion"
      description="Relative motion describes how the motion of an object appears from different reference frames. The velocity you observe depends on your own motion."
      topicNumber={7}
      prevTopic={{ name: 'Projectile Motion', path: '/topic/projectile-motion' }}
      nextTopic={{ name: 'Kinematics Graphs', path: '/topic/kinematics-graphs' }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Interactive Simulation</h3>
            <canvas
              ref={canvasRef}
              width={420}
              height={300}
              className="w-full simulation-canvas mb-4"
            />
            <div className="space-y-4">
              <PlayControls
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={handleReset}
              />
              <SliderControl
                label="Velocity of A"
                value={velocityA}
                onChange={setVelocityA}
                min={-5}
                max={8}
                step={0.5}
                unit=" m/s"
              />
              <SliderControl
                label="Velocity of B"
                value={velocityB}
                onChange={setVelocityB}
                min={-5}
                max={8}
                step={0.5}
                unit=" m/s"
              />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Reference Frame:</p>
                <div className="flex gap-2">
                  {(['ground', 'A', 'B'] as const).map((frame) => (
                    <button
                      key={frame}
                      onClick={() => setReferenceFrame(frame)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        referenceFrame === frame
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {frame === 'ground' ? 'Ground' : `Object ${frame}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border space-y-1">
                <ValueDisplay label="v_AB (A seen from B)" value={relativeVelocityAB} unit=" m/s" color="cyan" />
                <ValueDisplay label="v_BA (B seen from A)" value={relativeVelocityBA} unit=" m/s" color="yellow" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="Key Formulas" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Real World Example</h4>
              <p className="text-sm text-muted-foreground">
                When you're in a train moving at 60 km/h and another train passes at 80 km/h in the same direction, it appears to move at only 20 km/h relative to you!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default RelativeMotion;
