import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-vedic-night dark:bg-gray-900 text-white py-8 px-4 md:px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-vedic-gold">RigVeda Explorer</h3>
          <p className="text-sm text-gray-300">
            A comprehensive digital platform for exploring the oldest scripture of humanity.
            Experience the Rig Veda with modern tools and ancient wisdom.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-vedic-gold transition">Explore Verses</Link></li>
            <li><Link to="/discover" className="hover:text-vedic-gold transition">Visualizations</Link></li>
            <li><Link to="/learn" className="hover:text-vedic-gold transition">Learn More</Link></li>
            <li><Link to="/about" className="hover:text-vedic-gold transition">About This Project</Link></li>
          </ul>
        </div>

        {/* Attribution */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Sources & Attribution</h4>
          <p className="text-sm text-gray-300 mb-2">
            Translations by Griffith (1896), Jamison-Brereton (2014), and Wilson (1850).
          </p>
          <p className="text-xs text-gray-400">
            Educational and scholarly purposes only. All content properly attributed.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
        <p>RigVeda Explorer • Honoring ancient wisdom with modern technology</p>
        <p className="mt-1">No tracking • Privacy-first • Open source spirit</p>
      </div>
    </footer>
  );
};

export default Footer;
