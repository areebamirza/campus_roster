import client from './client';

export const getStudents = ({ name, courseId }) => {
  const params = courseId ? { courseId } : {};
  if (name) {
    return client.get('/students/search', { params: { ...params, name } }).then((res) => res.data);
  }
  return client.get('/students', { params }).then((res) => res.data);
};

export const createStudent = (student) => client.post('/students', student).then((res) => res.data);
export const updateStudent = (id, student) => client.put(`/students/${id}`, student).then((res) => res.data);
export const deleteStudent = (id) => client.delete(`/students/${id}`);
