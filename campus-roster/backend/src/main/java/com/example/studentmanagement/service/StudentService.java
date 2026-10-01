package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.ConflictException;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<StudentResponse> search(String name, Long courseId) {
        String keyword = name == null ? "" : name.trim();
        return studentRepository.searchStudents(keyword, courseId).stream().map(StudentResponse::from).toList();
    }

    public StudentResponse getById(Long id) {
        return StudentResponse.from(findStudent(id));
    }

    public StudentResponse create(StudentRequest request) {
        ensureEmailIsFree(request.email(), null);
        return save(new Student(), request);
    }

    public StudentResponse update(Long id, StudentRequest request) {
        Student student = findStudent(id);
        ensureEmailIsFree(request.email(), id);
        return save(student, request);
    }

    public void delete(Long id) {
        studentRepository.delete(findStudent(id));
    }

    private StudentResponse save(Student student, StudentRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        student.setName(request.name().trim());
        student.setEmail(request.email().trim());
        student.setAge(request.age());
        student.setCourse(course);
        return StudentResponse.from(studentRepository.save(student));
    }

    private Student findStudent(Long id) {
        return studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    private void ensureEmailIsFree(String email, Long currentStudentId) {
        studentRepository.findByEmailIgnoreCase(email.trim())
                .filter(existing -> !existing.getId().equals(currentStudentId))
                .ifPresent(existing -> {
                    throw new ConflictException("A student with this email already exists");
                });
    }
}
