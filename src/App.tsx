import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Discover from './pages/Discover';
import Learn from './pages/Learn';
import About from './pages/About';
import Settings from './pages/Settings';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Router>
);

export default App;
