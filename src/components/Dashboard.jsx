import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import CourseList from './CourseList';
import PopularCourses from './PopularCourses';
import Statistics from './Statistics';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Dashboard = ({ courseData }) => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'all');
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('searchTerm') || '');
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('sortOption') || '');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [viewedCourseIds, setViewedCourseIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('viewedCourses')) || [];
    } catch {
      return [];
    }
  });
  const [selectedCategories, setSelectedCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('selectedCategories')) || [];
    } catch {
      return [];
    }
  });
  const [navOpen, setNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🌙 Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavoriteIds(storedFavorites);
    } catch (error) {
      console.error('Fout bij het parsen van favorieten uit localStorage:', error);
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem('activeTab', activeTab), [activeTab]);
  useEffect(() => localStorage.setItem('searchTerm', searchTerm), [searchTerm]);
  useEffect(() => localStorage.setItem('sortOption', sortOption), [sortOption]);
  useEffect(() => localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories)), [selectedCategories]);
  useEffect(() => localStorage.setItem('viewedCourses', JSON.stringify(viewedCourseIds)), [viewedCourseIds]);
  useEffect(() => localStorage.setItem('darkMode', darkMode), [darkMode]); // 🌙 Save dark mode

  const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return 0;
    if (durationStr.includes(':')) {
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
    }
    const lower = durationStr.toLowerCase();
    if (lower.includes('uur')) return parseFloat(lower) * 60;
    if (lower.includes('min')) return parseFloat(lower);
    return parseFloat(durationStr) || 0;
  };

  const getAllCategories = () => {
    const all = courseData?.flatMap(course => course.categories || []);
    return [...new Set(all)];
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleViewed = (courseId) => {
    setViewedCourseIds(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    localStorage.removeItem('selectedCategories');
  };

  const filteredCourses = () => {
    if (!courseData || !Array.isArray(courseData)) return [];

    let filtered = [...courseData];

    if (activeTab === 'beginner') {
      filtered = filtered.filter(course => course.level === 'Beginner');
    } else if (activeTab === 'gevorderd') {
      filtered = filtered.filter(course => course.level === 'Gevorderd');
    } else if (activeTab === 'populair') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (activeTab === 'favorieten') {
      filtered = filtered.filter(course => favoriteIds.includes(String(course.id)));
    } else if (activeTab === 'bekeken') {
      filtered = filtered.filter(course => viewedCourseIds.includes(course.id));
    } else if (activeTab === 'onbekeken') {
      filtered = filtered.filter(course => !viewedCourseIds.includes(course.id));
    }

    if (activeTab === 'filteren' && selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        course.categories?.some(cat => selectedCategories.includes(cat))
      );
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(lowerSearch) ||
          course.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortOption === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'duration') {
      filtered.sort(
        (a, b) => parseDurationToMinutes(b.duration) - parseDurationToMinutes(a.duration)
      );
    }

    return filtered;
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setNavOpen(false);
  };

  return (
    <section className={`dashboard ${darkMode ? 'dark-mode' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
      <header className='dashboard-header'>
        <button
          className='mobile-nav-toggle'
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? '✖ Sluiten' : '☰ Menu'}
        </button>

        <button
          className='dark-mode-toggle'
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        <nav className={`tab-buttons ${navOpen ? 'open' : ''}`}>
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => handleTabClick('all')}>Alle Cursussen</button>
          <button className={activeTab === 'beginner' ? 'active' : ''} onClick={() => handleTabClick('beginner')}>Voor Beginners</button>
          <button className={activeTab === 'gevorderd' ? 'active' : ''} onClick={() => handleTabClick('gevorderd')}>Gevorderd</button>
          <button className={activeTab === 'populair' ? 'active' : ''} onClick={() => handleTabClick('populair')}>Meest Bekeken</button>
          <button className={activeTab === 'favorieten' ? 'active' : ''} onClick={() => handleTabClick('favorieten')}>⭐ Favorieten</button>
          <button className={activeTab === 'bekeken' ? 'active' : ''} onClick={() => handleTabClick('bekeken')}>👁️ Bekeken</button>
          <button className={activeTab === 'onbekeken' ? 'active' : ''} onClick={() => handleTabClick('onbekeken')}>🙈 Onbekeken</button>
          <button className={activeTab === 'filteren' ? 'active' : ''} onClick={() => handleTabClick('filteren')}>Meer Filter</button>
        </nav>
      </header>

      <div className='search-bar-container'>
        <input
          type='text'
          placeholder='Zoek op titel of trefwoord...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-bar'
        />
      </div>

      <div className='sort-container'>
        <label htmlFor='sort'>Sorteer op: </label>
        <select
          id='sort'
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className='sort-dropdown'
        >
          <option value=''>Standaard</option>
          <option value='views'>Populariteit</option>
          <option value='rating'>Rating</option>
          <option value='duration'>Duur</option>
        </select>
      </div>

      {activeTab === 'filteren' && (
        <div className='category-filter'>
          <h3>Categorieën</h3>
          <div className='category-buttons'>
            {getAllCategories().map((category) => (
              <button
                key={category}
                className={selectedCategories.includes(category) ? 'category selected' : 'category'}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
            <button onClick={clearFilters} className='clear-filters'>Wissen</button>
          </div>
        </div>
      )}

      <div className='dashboard-content fade-in'>
        {isLoading ? (
          <div className='loading-spinner'>Laden...</div>
        ) : (
          <>
            <section className='main-content'>
              <h2>
                {activeTab === 'all' && 'Alle Cursussen'}
                {activeTab === 'beginner' && 'Cursussen voor Beginners'}
                {activeTab === 'gevorderd' && 'Gevorderde Cursussen'}
                {activeTab === 'populair' && 'Meest Bekeken Cursussen'}
                {activeTab === 'favorieten' && 'Mijn Favorieten'}
                {activeTab === 'filteren' && 'Meer Filter Keuze'}
                {activeTab === 'bekeken' && 'Bekeken Cursussen'}
                {activeTab === 'onbekeken' && 'Onbekeken Cursussen'}
              </h2>
              <CourseList
                courses={filteredCourses()}
                viewedCourseIds={viewedCourseIds}
                onToggleViewed={toggleViewed}
              />
            </section>

            <aside className='sidebar'>
              <PopularCourses courses={courseData} />
              <Statistics courses={courseData} />
            </aside>
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
