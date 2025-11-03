import MandalaCard from './MandalaCard';
import mandalaInfo from '../../data/mandalaInfo.json';

interface MandalaGridProps {
  onMandalaSelect: (mandalaId: number) => void;
}

const MandalaGrid = ({ onMandalaSelect }: MandalaGridProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
      aria-label="Mandalas of Rigveda"
    >
      {mandalaInfo.map(mandala => (
        <MandalaCard key={mandala.id} mandala={mandala} onSelect={onMandalaSelect} />
      ))}
    </div>
  );
};

export default MandalaGrid;
