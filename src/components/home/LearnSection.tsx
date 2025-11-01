import IntroductionCard from './learn/IntroductionCard';
import StructureCard from './learn/StructureCard';
import DeitiesCard from './learn/DeitiesCard';
import ReadingGuideCard from './learn/ReadingGuideCard';
import CuratedCollectionsCard from './learn/CuratedCollectionsCard';

const LearnSection = () => {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-vedic-text">Learn About the Rig Veda</h3>
      <IntroductionCard />
      <StructureCard />
      <DeitiesCard />
      <ReadingGuideCard />
      <CuratedCollectionsCard />
    </section>
  );
};

export default LearnSection;
