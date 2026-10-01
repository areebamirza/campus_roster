import { useCallback, useEffect, useState } from 'react';
import { deleteStudent, getStudents } from '../api/studentApi';
import { getCourses } from '../api/courseApi';
import { getErrorMessage } from '../api/client';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import StudentForm from '../components/StudentForm.jsx';

export default function StudentsPage({ notify }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStudents(await getStudents({ name: search.trim(), courseId }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, courseId]);

  useEffect(() => {
    getCourses().then(setCourses).catch((err) => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadStudents, 300);
    return () => clearTimeout(timer);
  }, [loadStudents]);

  const openForm = (student = null) => {
    setEditing(student);
    setShowForm(true);
  };

  const handleSaved = (message) => {
    setShowForm(false);
    notify(message);
    loadStudents();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteStudent(toDelete.id);
      notify('Student deleted');
      loadStudents();
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
        <h1>Student Management</h1>
        <button className="btn primary" onClick={() => openForm()}>+ Add Student</button>
      </div>

      <div className="toolbar">
        <input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
        </select>
      </div>

      <StatusMessage loading={loading} error={error} empty={!loading && !error && students.length === 0}
        emptyText="No students found." onRetry={loadStudents} />

      {!loading && !error && students.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Student Name</th><th>Email</th><th>Age</th><th>Course</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td data-label="ID">{student.id}</td>
                  <td data-label="Name">{student.name}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Age">{student.age}</td>
                  <td data-label="Course"><span className="tag">{student.courseName}</span></td>
                  <td data-label="Actions" className="actions">
                    <button className="btn ghost" onClick={() => openForm(student)}>Edit</button>
                    <button className="btn danger" onClick={() => setToDelete(student)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Student' : 'Add Student'} onClose={() => setShowForm(false)}>
          <StudentForm student={editing} courses={courses} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog message="Are you sure you want to delete this student?" busy={deleting}
          onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
      )}
    </section>
  );
}
