import client from './client';

export const getCourses = () => client.get('/courses').then((res) => res.data);
export const createCourse = (course) => client.post('/courses', course).then((res) => res.data);
export const updateCourse = (id, course) => client.put(`/courses/${id}`, course).then((res) => res.data);
export const deleteCourse = (id) => client.delete(`/courses/${id}`);
