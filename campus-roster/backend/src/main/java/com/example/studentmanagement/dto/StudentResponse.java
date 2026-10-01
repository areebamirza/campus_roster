package com.example.studentmanagement.dto;

import com.example.studentmanagement.entity.Student;

public record StudentResponse(Long id, String name, String email, Integer age, Long courseId, String courseName) {

    public static StudentResponse from(Student student) {
        return new StudentResponse(student.getId(), student.getName(), student.getEmail(), student.getAge(),
                student.getCourse().getId(), student.getCourse().getName());
    }
}
