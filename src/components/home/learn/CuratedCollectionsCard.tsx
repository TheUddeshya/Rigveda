import { ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

const CuratedCollectionsCard = () => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl">
      <h4 className="text-2xl font-bold mb-4 text-vedic-text flex items-center gap-2">
        <ScrollText size={24} />
        Curated Collections
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/explore">
          <div className={cn(
            "bg-gradient-to-br from-accent/30 to-vedic-gold/20 p-6 rounded-lg",
            "border border-vedic-accent/20",
            "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
            "transition-all duration-300 cursor-pointer"
          )}>
            <h5 className="font-bold text-lg mb-2 text-foreground">Essential Hymns</h5>
            <p className="text-sm text-muted-foreground mb-3">
              10 foundational hymns every reader should know
            </p>
            <span className="text-accent font-semibold text-sm">Start Reading →</span>
          </div>
        </Link>
        <Link to="/explore">
          <div className={cn(
            "bg-gradient-to-br from-vedic-soma/30 to-vedic-ushas/20 p-6 rounded-lg",
            "border border-vedic-accent/20",
            "hover:border-accent hover:shadow-xl hover:shadow-accent/10",
            "transition-all duration-300 cursor-pointer"
          )}>
            <h5 className="font-bold text-lg mb-2 text-foreground">Cosmic Hymns</h5>
            <p className="text-sm text-muted-foreground mb-3">
              Creation, cosmology, and philosophical wisdom
            </p>
            <span className="text-accent font-semibold text-sm">Explore →</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CuratedCollectionsCard;
