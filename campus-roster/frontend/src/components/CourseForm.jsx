import { useState } from 'react';
import { createCourse, updateCourse } from '../api/courseApi';
import { getErrorMessage } from '../api/client';

export default function CourseForm({ course, onSaved, onCancel }) {
  const [form, setForm] = useState({ name: course?.name ?? '', duration: course?.duration ?? '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError('');
    const payload = { name: form.name, duration: form.duration === '' ? null : Number(form.duration) };
    try {
      if (course) await updateCourse(course.id, payload);
      else await createCourse(payload);
      onSaved(course ? 'Course updated' : 'Course added');
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
        <label>Course Name
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>Duration (months)
          <input name="duration" type="number" value={form.duration} onChange={handleChange} />
          {errors.duration && <span className="field-error">{errors.duration}</span>}
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}
