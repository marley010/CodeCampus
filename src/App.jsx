import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import ProfilePage from './components/profile';
import { courses } from './data/coursesData.js';
import './styles/App.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Terug
      </button>
      <Link to="/profile" className="profile-link">Profiel</Link>
    </nav>
  );
}

function AppContent({ courseData, isLoading, error }) {
  if (isLoading) return <section className='loading'>Cursussen worden geladen...</section>;
  if (error) return <section className='error'>{error}</section>;

  return (
    <>
      <Navbar /> {/* Navbar bovenaan */}
      <header className='app-header'>
        <div className='logo-container'>
          <h1 className='brand-logo'>CodeCampus</h1>
          <p className='brand-tagline'>Ontdek, Leer, Excelleer</p>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard courseData={courseData} />} />
        <Route path="/courses/:id" element={<CourseDetail courseData={courseData} />} />
        <Route path="/profile" element={<ProfilePage courseData={courseData} />} />
      </Routes>
    </>
  );
}

function App() {
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setCourseData(courses);
        setIsLoading(false);
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van de cursussen.');
        setIsLoading(false);
      }
    };

    setTimeout(fetchData, 1000);
  }, []);

  return (
    <Router>
      <main className='app'>
        <AppContent courseData={courseData} isLoading={isLoading} error={error} />
      </main>
    </Router>
  );
}

export default App;
