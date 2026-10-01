package com.example.studentmanagement.config;

import com.example.studentmanagement.entity.Course;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.CourseRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(CourseRepository courseRepository, StudentRepository studentRepository) {
        return args -> {
            if (courseRepository.count() > 0) {
                return;
            }
            Course java = courseRepository.save(new Course("Java", 6));
            Course react = courseRepository.save(new Course("React", 3));
            Course spring = courseRepository.save(new Course("Spring Boot", 4));
            studentRepository.save(newStudent("Areeba Khan", "areeba@example.com", 22, java));
            studentRepository.save(newStudent("Rohan Verma", "rohan@example.com", 24, react));
            studentRepository.save(newStudent("Sara Ali", "sara@example.com", 21, spring));
        };
    }

    private Student newStudent(String name, String email, int age, Course course) {
        Student student = new Student();
        student.setName(name);
        student.setEmail(email);
        student.setAge(age);
        student.setCourse(course);
        return student;
    }
}
