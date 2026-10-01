package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Student;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("""
            SELECT s FROM Student s
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))
              AND (:courseId IS NULL OR s.course.id = :courseId)
            ORDER BY s.id
            """)
    List<Student> searchStudents(@Param("name") String name, @Param("courseId") Long courseId);

    Optional<Student> findByEmailIgnoreCase(String email);

    boolean existsByCourseId(Long courseId);
}
