import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#181C14] dark:bg-[#3C3D37] py-8 px-4 md:px-6 mt-12 border-t border-vedic-accent/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-[#ECDFCC]">RigVeda Explorer</h3>
          <p className="text-sm text-[#ECDFCC]/80">
            A comprehensive digital platform for exploring the oldest scripture of humanity.
            Experience the Rig Veda with modern tools and ancient wisdom.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-[#ECDFCC]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="text-[#ECDFCC]/80 hover:text-[#697565] transition">Explore Verses</Link></li>
            <li><Link to="/discover" className="text-[#ECDFCC]/80 hover:text-[#697565] transition">Visualizations</Link></li>
          </ul>
        </div>

        {/* Attribution */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-[#ECDFCC]">Sources & Attribution</h4>
          <p className="text-sm text-[#ECDFCC]/80 mb-2">
            Translations by Griffith (1896), Jamison-Brereton (2014), and Wilson (1850).
          </p>
          <p className="text-xs text-[#ECDFCC]/60">
            Educational and scholarly purposes only. All content properly attributed.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#697565]/30 text-center text-sm text-[#ECDFCC]/70">
        <p>RigVeda</p>
      </div>
    </footer>
  );
};

export default Footer;
