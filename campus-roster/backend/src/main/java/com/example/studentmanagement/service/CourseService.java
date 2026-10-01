package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.exception.ConflictException;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public CourseService(CourseRepository courseRepository, StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    public Course getById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    public Course create(Course course) {
        course.setId(null);
        return courseRepository.save(course);
    }

    public Course update(Long id, Course updated) {
        Course course = getById(id);
        course.setName(updated.getName().trim());
        course.setDuration(updated.getDuration());
        return courseRepository.save(course);
    }

    public void delete(Long id) {
        Course course = getById(id);
        if (studentRepository.existsByCourseId(id)) {
            throw new ConflictException("Cannot delete a course that still has students");
        }
        courseRepository.delete(course);
    }
}
