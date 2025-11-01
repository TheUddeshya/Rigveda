import { Users } from 'lucide-react';

const DeitiesCard = () => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
      <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
        <Users size={24} />
        Principal Deities
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-l-4 border-vedic-agni pl-4">
          <h5 className="font-bold text-lg mb-1 text-foreground">Agni (Fire)</h5>
          <p className="text-sm text-muted-foreground">
            Mediator between humans and gods, messenger who carries offerings to the divine realm. Most frequently mentioned deity.
          </p>
        </div>
        <div className="border-l-4 border-vedic-gold pl-4">
          <h5 className="font-bold text-lg mb-1 text-foreground">Indra (Thunder & War)</h5>
          <p className="text-sm text-muted-foreground">
            King of the gods, warrior deity who battles demons and brings rain. Second most mentioned deity.
          </p>
        </div>
        <div className="border-l-4 border-vedic-soma pl-4">
          <h5 className="font-bold text-lg mb-1 text-foreground">Soma (Sacred Plant)</h5>
          <p className="text-sm text-muted-foreground">
            Deity of the sacred plant and its intoxicating juice used in rituals. Entire Mandala 9 is dedicated to Soma.
          </p>
        </div>
        <div className="border-l-4 border-vedic-ushas pl-4">
          <h5 className="font-bold text-lg mb-1 text-foreground">Ushas (Dawn)</h5>
          <p className="text-sm text-muted-foreground">
            Goddess of dawn, symbol of renewal and consciousness. Associated with beauty and awakening.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeitiesCard;
