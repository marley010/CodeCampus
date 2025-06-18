import { Link } from 'react-router-dom';
import '../styles/profile.css';

const ProfilePage = ({ courseData }) => {
  const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoriteCourses = courseData.filter(course => favoriteIds.includes(String(course.id)));

  return (
    <div className="profile-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt; Mijn Profiel
      </nav>
      <h1>Mijn Profiel</h1>

      <section className="profile-section">
        <h2>Mijn Favoriete Cursussen</h2>
        {favoriteCourses.length === 0 ? (
          <p>Je hebt nog geen favoriete cursussen toegevoegd.</p>
        ) : (
          <ul className="course-list">
            {favoriteCourses.map(course => (
              <li key={course.id}>
                <Link to={`/courses/${course.id}`}>{course.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
