import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center py-16 md:py-24 px-4"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-7xl sm:text-8xl md:text-9xl font-sanskrit mb-8 text-center text-vedic-text"
      >ऋग्वेदः</motion.h1>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Link to="/explore">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-full px-10 py-4 sm:px-14 sm:py-5 text-lg font-semibold",
              "bg-accent text-accent-foreground",
              "hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/20",
              "transition-all duration-300",
              "border-2 border-accent/50 hover:border-accent",
              "min-h-[44px] min-w-[44px]"
            )}
          >Begin Your Journey →</motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
