import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

export const PlayControls = ({ isPlaying, onPlayPause, onReset }: PlayControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className="w-10 h-10 border-primary/50 hover:bg-primary/20 hover:border-primary"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-primary" />
        ) : (
          <Play className="w-4 h-4 text-primary" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="w-10 h-10 border-border hover:bg-muted"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
}: SliderControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <span className="text-sm font-mono text-primary">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

interface ToggleControlProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ToggleControl = ({ label, checked, onCheckedChange }: ToggleControlProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

interface ValueDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'cyan' | 'yellow' | 'red' | 'green' | 'purple';
}

export const ValueDisplay = ({ label, value, unit = '', color = 'cyan' }: ValueDisplayProps) => {
  const colorClasses = {
    cyan: 'text-cyan',
    yellow: 'text-yellow',
    red: 'text-red',
    green: 'text-green',
    purple: 'text-purple',
  };

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono ${colorClasses[color]}`}>
        {typeof value === 'number' ? value.toFixed(2) : value}{unit}
      </span>
    </div>
  );
};
