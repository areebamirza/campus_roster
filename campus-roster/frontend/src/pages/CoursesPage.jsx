import { useCallback, useEffect, useState } from 'react';
import { deleteCourse, getCourses } from '../api/courseApi';
import { getErrorMessage } from '../api/client';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import CourseForm from '../components/CourseForm.jsx';

export default function CoursesPage({ notify }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCourses(await getCourses());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openForm = (course = null) => {
    setEditing(course);
    setShowForm(true);
  };

  const handleSaved = (message) => {
    setShowForm(false);
    notify(message);
    loadCourses();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCourse(toDelete.id);
      notify('Course deleted');
      loadCourses();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setToDelete(null);
      setDeleting(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <h1>Courses</h1>
        <button className="btn primary" onClick={() => openForm()}>+ Add Course</button>
      </div>

      <StatusMessage loading={loading} error={error} empty={!loading && !error && courses.length === 0}
        emptyText="No courses yet. Add your first course." onRetry={loadCourses} />

      {!loading && !error && courses.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Course Name</th><th>Duration</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td data-label="ID">{course.id}</td>
                  <td data-label="Name">{course.name}</td>
                  <td data-label="Duration">{course.duration} months</td>
                  <td data-label="Actions" className="actions">
                    <button className="btn ghost" onClick={() => openForm(course)}>Edit</button>
                    <button className="btn danger" onClick={() => setToDelete(course)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Course' : 'Add Course'} onClose={() => setShowForm(false)}>
          <CourseForm course={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog message="Are you sure you want to delete this course?" busy={deleting}
          onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
      )}
    </section>
  );
}
