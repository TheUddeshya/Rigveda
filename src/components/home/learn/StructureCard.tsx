import { Book } from 'lucide-react';

const StructureCard = () => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
      <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
        <Book size={24} />
        Structure & Organization
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
            <h5 className="font-bold mb-2 text-foreground">10 Mandalas (Books)</h5>
            <p className="text-sm text-muted-foreground">
              Books 2-7 are the oldest (Family Books), each attributed to a specific rishi family. Books 1, 8, 9, and 10 were compiled later.
            </p>
          </div>
          <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
            <h5 className="font-bold mb-2 text-foreground">1,028 Hymns (Suktas)</h5>
            <p className="text-sm text-muted-foreground">
              Each hymn is dedicated to a specific deity or concept, composed by ancient seers (rishis).
            </p>
          </div>
          <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
            <h5 className="font-bold mb-2 text-foreground">10,552 Verses</h5>
            <p className="text-sm text-muted-foreground">
              Composed in various poetic meters, primarily Gayatri, Trishtubh, and Jagati.
            </p>
          </div>
          <div className="bg-vedic-ui/50 border border-vedic-accent/20 p-4 rounded-lg hover:border-accent transition-all duration-200">
            <h5 className="font-bold mb-2 text-foreground">Multiple Deities</h5>
            <p className="text-sm text-muted-foreground">
              Major deities include Agni (fire), Indra (warrior god), Soma (sacred plant), and Ushas (dawn).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureCard;
