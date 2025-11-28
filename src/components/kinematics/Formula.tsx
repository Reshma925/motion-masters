import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FormulaProps {
  latex: string;
  tooltip?: string;
  className?: string;
  displayMode?: boolean;
}

export const Formula = ({ latex, tooltip, className = '', displayMode = false }: FormulaProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(latex, containerRef.current, {
        throwOnError: false,
        displayMode,
      });
    }
  }, [latex, displayMode]);

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={containerRef}
            className={`cursor-help transition-all duration-200 hover:text-primary ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-card border-border">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <span ref={containerRef} className={className} />;
};

interface FormulaCardProps {
  formulas: Array<{
    latex: string;
    description: string;
  }>;
  title?: string;
}

export const FormulaCard = ({ formulas, title }: FormulaCardProps) => {
  return (
    <div className="formula-card space-y-3">
      {title && (
        <h4 className="text-sm font-medium text-primary mb-3">{title}</h4>
      )}
      <div className="space-y-2">
        {formulas.map((formula, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Formula
              latex={formula.latex}
              tooltip={formula.description}
              className="text-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
