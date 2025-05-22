import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/CourseDetail.css';

const CourseDetail = ({ courseData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const course = courseData.find((c) => c.id.toString() === id);

  // Controleer bij laden of deze cursus al favoriet is
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  if (!course) {
    return <p className="course-detail">Cursus niet gevonden.</p>;
  }

  return (
    <section className="course-detail">
      <h2 className="course-title">
        {course.title}
        <button
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </h2>

      <img src={course.imageUrl} alt={course.title} className="detail-image" />

      <div className="main-content">
        <div className="course-info">
          <section className="description">
            <p>{course.description}</p>
          </section>

          <div className="course-actions">
            <button className="course-button" onClick={() => navigate(-1)}>
              ← Terug
            </button>
            <button
              className="course-button"
              onClick={() => window.open(course.videoUrl, '_blank')}
            >
              Bekijk Video
            </button>
          </div>
        </div>

        <aside className="details-sidebar">
          <h3>Details</h3>
          <ul>
            <li><strong>Niveau:</strong> {course.level}</li>
            <li><strong>Duur:</strong> {course.duration}</li>
            <li><strong>Leden:</strong> {course.members}</li>
            <li><strong>Weergaven:</strong> {course.views}</li>
            <li><strong>Rating:</strong> ⭐ {course.rating}</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default CourseDetail;
