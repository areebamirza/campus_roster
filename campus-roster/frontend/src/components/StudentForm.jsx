import { useState } from 'react';
import { createStudent, updateStudent } from '../api/studentApi';
import { getErrorMessage } from '../api/client';

export default function StudentForm({ student, courses, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    age: student?.age ?? '',
    courseId: student?.courseId ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    const payload = {
      ...form,
      age: form.age === '' ? null : Number(form.age),
      courseId: form.courseId === '' ? null : Number(form.courseId),
    };
    try {
      if (student) await updateStudent(student.id, payload);
      else await createStudent(payload);
      onSaved(student ? 'Student updated' : 'Student added');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert">{formError}</div>}
      <div className="form-grid">
        <label>Name
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>Age
          <input name="age" type="number" value={form.age} onChange={handleChange} />
          {errors.age && <span className="field-error">{errors.age}</span>}
        </label>
        <label>Course
          <select name="courseId" value={form.courseId} onChange={handleChange}>
            <option value="">Select a course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
          {errors.courseId && <span className="field-error">{errors.courseId}</span>}
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button>
      </div>
    </form>
  );
}
