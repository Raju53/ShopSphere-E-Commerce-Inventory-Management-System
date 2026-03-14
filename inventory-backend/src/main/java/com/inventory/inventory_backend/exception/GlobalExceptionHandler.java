package com.inventory.inventory_backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // 1. Resource Not Found (404)
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Resource Not Found")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        // 2. Validation Errors (400) - FIXED: Consolidated into Map for easier Frontend
        // parsing
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
                // Returns e.g., {"phoneNumber": "Must be 10 digits", "dob": "Must be in the
                // past"}
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        // 3. Type Mismatch (400) - e.g., passing "abc" as a Long ID
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Type Mismatch")
                                .message("Invalid value for parameter: " + ex.getName())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // 4. Runtime Exceptions (400) - e.g., custom business logic errors (Stock
        // issues)
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiError> handleRuntime(RuntimeException ex, HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // 5. Generic Exception (500)
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("Internal Server Error")
                                .message("Something went wrong on our end")
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}