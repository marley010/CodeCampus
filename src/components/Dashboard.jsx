import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import CourseList from './CourseList';
import PopularCourses from './PopularCourses';
import Statistics from './Statistics';

const Dashboard = ({ courseData }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Haal favoriete IDs op uit localStorage bij laden
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteIds(storedFavorites);
  }, []);

  const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return 0;

    if (durationStr.includes(':')) {
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      }
    }

    const lower = durationStr.toLowerCase();
    if (lower.includes('uur')) {
      const hours = parseFloat(lower);
      return hours * 60;
    }
    if (lower.includes('min')) {
      return parseFloat(lower);
    }

    return parseFloat(durationStr) || 0;
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
      filtered = filtered.filter(course => favoriteIds.includes(course.id.toString()));
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

  return (
    <section className='dashboard'>
      <header className='dashboard-header'>
        <nav className='tab-buttons'>
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>Alle Cursussen</button>
          <button className={activeTab === 'beginner' ? 'active' : ''} onClick={() => setActiveTab('beginner')}>Voor Beginners</button>
          <button className={activeTab === 'gevorderd' ? 'active' : ''} onClick={() => setActiveTab('gevorderd')}>Gevorderd</button>
          <button className={activeTab === 'populair' ? 'active' : ''} onClick={() => setActiveTab('populair')}>Meest Bekeken</button>
          <button className={activeTab === 'favorieten' ? 'active' : ''} onClick={() => setActiveTab('favorieten')}>⭐ Favorieten</button>
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

      <div className='dashboard-content'>
        <section className='main-content'>
          <h2>
            {activeTab === 'all'
              ? 'Alle Cursussen'
              : activeTab === 'beginner'
              ? 'Cursussen voor Beginners'
              : activeTab === 'gevorderd'
              ? 'Gevorderde Cursussen'
              : activeTab === 'favorieten'
              ? 'Mijn Favorieten'
              : 'Meest Bekeken Cursussen'}
          </h2>
          <CourseList courses={filteredCourses()} />
        </section>

        <aside className='sidebar'>
          <PopularCourses courses={courseData} />
          <Statistics courses={courseData} />
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;
