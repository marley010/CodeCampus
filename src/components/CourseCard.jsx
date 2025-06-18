import { useNavigate } from 'react-router-dom';
import '../styles/CourseCard.css';

const CourseCard = ({ course, isViewed, onToggleViewed }) => {
  const navigate = useNavigate();

  if (!course)
    return (
      <article className='course-card empty'>
        Geen cursus informatie beschikbaar
      </article>
    );

  const openCourseVideo = (url) => {
    return (e) => {
      e.stopPropagation(); // voorkomt navigatie bij klikken op knop
      window.open(url, '_blank');
    };
  };

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <article
      className={`course-card ${isViewed ? 'viewed' : ''}`}
      onClick={handleCardClick}
    >
      <figure className='course-image'>
        <img src={course.imageUrl} alt={course.title} />
      </figure>
      <div className='course-content'>
        <h3>{course.title}</h3>
        <p className='course-description'>{course.description}</p>
        <dl className='course-details'>
          <div>
            <dt className='visually-hidden'>Niveau</dt>
            <dd className='level'>Niveau: {course.level}</dd>
          </div>
          <div>
            <dt className='visually-hidden'>Duur</dt>
            <dd className='duration'>Duur: {course.duration}</dd>
          </div>
        </dl>
        <footer className='course-stats'>
          <span className='members'>{course.members} leden</span>
          <span className='views'>{course.views} weergaven</span>
          <span className='rating'>⭐ {course.rating}</span>
        </footer>
        <div className='course-actions'>
          <button
            className='course-button'
            onClick={openCourseVideo(course.videoUrl)}
          >
            Bekijk Video
          </button>
          <button
            className='viewed-button'
            onClick={(e) => {
              e.stopPropagation();
              onToggleViewed(course.id);
            }}
          >
            {isViewed ? 'Bekeken ✔' : 'Markeer als bekeken'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
