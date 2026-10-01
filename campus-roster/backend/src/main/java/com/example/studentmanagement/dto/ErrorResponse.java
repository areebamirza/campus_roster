package com.example.studentmanagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(String message, int status, LocalDateTime timestamp, Map<String, String> errors) {

    public static ErrorResponse of(String message, int status, Map<String, String> errors) {
        return new ErrorResponse(message, status, LocalDateTime.now(), errors);
    }
}
