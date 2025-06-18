import CourseCard from './CourseCard';

const CourseList = ({ courses, viewedCourseIds, onToggleViewed }) => {
  if (!courses || courses.length === 0) {
    return <p className='empty-list'>Geen cursussen gevonden.</p>;
  }

  return (
    <section className='course-list'>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isViewed={viewedCourseIds.includes(course.id)}
          onToggleViewed={() => onToggleViewed(course.id)}
        />
      ))}
    </section>
  );
};

export default CourseList;
