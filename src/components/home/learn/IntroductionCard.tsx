const IntroductionCard = () => {
  return (
    <div className="bg-card border border-vedic-accent/20 rounded-xl p-6 md:p-8 shadow-xl mb-8">
      <h4 className="text-2xl font-bold mb-4 text-vedic-text">What is the Rig Veda?</h4>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          The Rig Veda is the oldest of the four Vedas and one of the oldest sacred texts in the world. Composed in Vedic Sanskrit between approximately 1500-1200 BCE, it consists of 1,028 hymns (suktas) arranged in 10 books (mandalas) containing 10,552 verses.
        </p>
        <p>
          These hymns are primarily addressed to various deities and natural forces, expressing profound philosophical insights, cosmological concepts, and ritual practices of ancient Vedic civilization.
        </p>
      </div>
    </div>
  );
};

export default IntroductionCard;
