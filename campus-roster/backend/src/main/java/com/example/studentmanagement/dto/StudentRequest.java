package com.example.studentmanagement.dto;

import jakarta.validation.constraints.*;

public record StudentRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Email is required") @Email(message = "Email format is invalid") String email,
        @NotNull(message = "Age is required")
        @Min(value = 16, message = "Age must be at least 16")
        @Max(value = 60, message = "Age must be at most 60") Integer age,
        @NotNull(message = "Course is required") Long courseId) {
}
