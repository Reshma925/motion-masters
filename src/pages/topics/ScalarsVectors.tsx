import { useState, useEffect, useRef } from 'react';
import { TopicLayout } from '@/components/kinematics/TopicLayout';
import { FormulaCard } from '@/components/kinematics/Formula';
import { SliderControl, ToggleControl, ValueDisplay } from '@/components/kinematics/SimulationControls';
import { Card, CardContent } from '@/components/ui/card';

const formulas = [
  { latex: '\\vec{A} = |A| \\hat{a}', description: 'A vector equals its magnitude times its unit vector' },
  { latex: '|\\vec{A}| = \\sqrt{A_x^2 + A_y^2}', description: 'Magnitude of a 2D vector' },
  { latex: '\\theta = \\tan^{-1}\\left(\\frac{A_y}{A_x}\\right)', description: 'Direction angle of a vector' },
];

const ScalarsVectors = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVector, setShowVector] = useState(true);
  const [magnitude, setMagnitude] = useState(100);
  const [angle, setAngle] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
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

    // Draw axes
    ctx.strokeStyle = 'hsl(215, 20%, 40%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Calculate end point
    const radians = (angle * Math.PI) / 180;
    const endX = centerX + magnitude * Math.cos(radians);
    const endY = centerY - magnitude * Math.sin(radians);

    if (showVector) {
      // Draw vector arrow
      ctx.strokeStyle = 'hsl(190, 100%, 50%)';
      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.lineWidth = 3;
      
      // Arrow line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow head
      const headLength = 15;
      const headAngle = Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(radians - headAngle),
        endY + headLength * Math.sin(radians - headAngle)
      );
      ctx.lineTo(
        endX - headLength * Math.cos(radians + headAngle),
        endY + headLength * Math.sin(radians + headAngle)
      );
      ctx.closePath();
      ctx.fill();

      // Draw angle arc
      ctx.strokeStyle = 'hsl(45, 100%, 50%)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, -radians, true);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'hsl(210, 40%, 98%)';
      ctx.font = '14px monospace';
      ctx.fillText(`|A| = ${magnitude}`, endX + 10, endY - 10);
      ctx.fillStyle = 'hsl(45, 100%, 50%)';
      ctx.fillText(`θ = ${angle}°`, centerX + 40, centerY - 10);
    } else {
      // Show scalar (just a number)
      ctx.fillStyle = 'hsl(190, 100%, 50%)';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(magnitude.toString(), centerX, centerY + 15);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'hsl(215, 20%, 65%)';
      ctx.fillText('(Scalar: magnitude only)', centerX, centerY + 50);
    }
  }, [showVector, magnitude, angle]);

  return (
    <TopicLayout
      title="Scalars & Vectors"
      description="Scalars have only magnitude (size). Vectors have both magnitude and direction, represented by arrows."
      topicNumber={1}
      nextTopic={{ name: 'Distance & Displacement', path: '/topic/distance-displacement' }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Simulation */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Interactive Simulation</h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full simulation-canvas mb-4"
            />
            <div className="space-y-4">
              <ToggleControl
                label="Show as Vector (vs Scalar)"
                checked={showVector}
                onCheckedChange={setShowVector}
              />
              <SliderControl
                label="Magnitude"
                value={magnitude}
                onChange={setMagnitude}
                min={20}
                max={150}
              />
              {showVector && (
                <SliderControl
                  label="Direction (angle)"
                  value={angle}
                  onChange={setAngle}
                  min={0}
                  max={360}
                  unit="°"
                />
              )}
              <div className="pt-2 border-t border-border">
                <ValueDisplay label="Magnitude" value={magnitude} unit=" units" />
                {showVector && <ValueDisplay label="Direction" value={angle} unit="°" color="yellow" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulas */}
        <div className="space-y-4">
          <FormulaCard formulas={formulas} title="Key Formulas" />
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-primary mb-2">Examples</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="text-foreground">Scalars:</span> Mass, Temperature, Speed, Time, Distance</p>
                <p><span className="text-foreground">Vectors:</span> Velocity, Acceleration, Displacement, Force</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopicLayout>
  );
};

export default ScalarsVectors;
