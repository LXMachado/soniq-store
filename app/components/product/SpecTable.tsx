import { AnimateIn } from '../motion/AnimateIn';

interface Metafield {
  key: string;
  value: string;
}

interface SpecTableProps {
  specs: Metafield[];
}

const SPEC_LABELS: Record<string, string> = {
  driver_type: 'Driver Type',
  impedance: 'Impedance',
  frequency_response: 'Frequency Response',
  sensitivity: 'Sensitivity',
  weight: 'Weight',
  connector: 'Connector',
  cable_length: 'Cable Length',
};

export function SpecTable({ specs }: SpecTableProps) {
  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <AnimateIn>
      <div className="border border-border/50 rounded-xl overflow-hidden bg-bg-secondary">
        <div className="px-5 py-4 border-b border-border/50">
          <h3 className="font-display text-lg font-semibold">Specifications</h3>
        </div>
        <div className="divide-y divide-border/30">
          {specs.map((spec) => {
            const label = SPEC_LABELS[spec.key] || spec.key.replace(/_/g, ' ');
            return (
              <div
                key={spec.key}
                className="grid grid-cols-2 px-5 py-3.5"
              >
                <span className="text-sm text-text-secondary">{label}</span>
                <span className="text-sm font-mono text-text-primary text-right">
                  {spec.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AnimateIn>
  );
}