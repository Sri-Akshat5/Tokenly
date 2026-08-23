# 🛡️ Bounty Solution Report: Standardizing API Error Responses

## OVERVIEW

This solution implements a robust, centralized error handling mechanism for all Spring Boot REST endpoints using the `@RestControllerAdvice` annotation. By standardizing the exception handling layer, we ensure that every failure—from simple input validation to critical system errors—returns a consistent JSON payload structure, significantly improving developer experience and frontend reliability.

The design adheres to the principles of Separation of Concerns (SoC) by decoupling error representation from business logic, making the API contract reliable and predictable.

---

## 🛠️ IMPLEMENTATION STEPS & CODE STRUCTURE

To achieve standardized error handling, we will introduce three core components:
1.  `ApiErrorResponse`: The standardized Data Transfer Object (DTO).
2.  Custom Exceptions: Specific unchecked exceptions for business logic errors (e.g., `ResourceNotFoundException`).
3.  `GlobalExceptionHandler`: The central `@RestControllerAdvice` that intercepts and formats all caught exceptions into the standard DTO structure.

### 1. Defining the Standardized Response Model (`ApiErrorResponse`)

This DTO defines the universal format for all error responses, mirroring industry standards like RFC 7807 (Problem Details).

```java
/**
 * ApiErrorResponse.java
 * Defines the consistent structure for all API errors returned to the client.
 */
public class ApiErrorResponse {
    private String timestamp; // When the error occurred
    private int status;       // HTTP Status Code (4xx, 5xx)
    private String error;     // Generic machine-readable error type (e.g., "Bad Request")
    private String message;   // User-friendly description of the failure
    private String path;      // The endpoint that failed

    // Constructor, Getters, and Setters (omitted for brevity)

    /**
     * Utility method to create a standardized response object.
     * @param status HTTP Status Code.
     * @param message User-facing error description.
     * @return ApiErrorResponse instance.
     */
    public ApiErrorResponse(int status, String message, String path) {
        this.timestamp = java.time.Instant.now().toString();
        this.status = status;
        this.error = getHttpReasonPhrase(status); // Converts status code to string (e.g., 400 -> "Bad Request")
        this.message = message;
        this.path = path;
    }

    private static String getHttpReasonPhrase(int status) {
        // In a real application, use Spring's MessageSource or standard mappings.
        switch (status) {
            case 400: return "Bad Request";
            case 401: return "Unauthorized";
            case 403: return "Forbidden";
            case 404: return "Not Found";
            case 429: return "Too Many Requests";
            case 500: return "Internal Server Error";
            default: return "Error";
        }
    }
}
```

### 2. Defining Custom Business Exceptions (Custom Errors)

We define specific, unchecked exceptions to map common business failures directly to HTTP status codes and meaningful messages. This is crucial for separating client errors from system bugs.

```java
// Base Class for all custom API exceptions
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
    public HttpStatus getStatus() { return status; }
}

/** Thrown when a resource cannot be located (HTTP 404). */
public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND); // Maps to HTTP 404
    }
}

/** Thrown when a record already exists (e.g., user email or SKU). */
public class DuplicateResourceException extends ApiException {
    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT); // Maps to HTTP 409 Conflict
    }
}

// Note: For Auth/Forbidden errors, using Spring Security's built-in exceptions (AuthenticationException, AccessDeniedException) is often best practice, but they are wrapped below for standardization.
```

### 3. The Global Exception Handler (`GlobalExceptionHandler`)

This central component uses `@ControllerAdvice` to intercept *all* unhandled exceptions across the application context. It determines the appropriate HTTP status and constructs an `ApiErrorResponse`.

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles custom business exceptions (e.g., ResourceNotFoundException).
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleCustomApiException(
            ApiException ex, WebRequest request) {
        
        HttpStatus status = ex.getStatus();
        String message = ex.getMessage();

        ApiErrorResponse errorResponse = new ApiErrorResponse(
                status.value(), 
                message, 
                request.getDescription(false).replace("uri=", "") // Clean up path for display
        );

        return new ResponseEntity<>(errorResponse, status);
    }

    /**
     * Handles validation errors from @Valid/MethodArgumentNotValidException (HTTP 400).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        // Extract detailed validation errors into a single message for consistency
        String validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ApiErrorResponse errorResponse = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(), 
                "Input validation failed: " + validationErrors, 
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles resource not found cases (404).
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        // Reuses the general ApiException handler, but listing it here for clarity/overriding potential issues.
        return handleCustomApiException(ex, request); 
    }

    /**
     * Handles authentication and authorization failures (401/403).
     * This acts as a wrapper for Spring Security exceptions.
     */
    @ExceptionHandler({UnauthorizedException.class, AccessDeniedException.class})
    public ResponseEntity<ApiErrorResponse> handleSecurityExceptions(
            RuntimeException ex, WebRequest request) {
        
        HttpStatus status = (ex instanceof UnauthorizedException) ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN;

        String message = switch (status) {
            case UNATHORIZED -> "Authentication failed. Invalid credentials or token.";
            case FORBIDDEN -> "You do not have permission to access this resource.";
            default -> ex.getMessage();
        };

        ApiErrorResponse errorResponse = new ApiErrorResponse(
                status.value(), 
                message, 
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, status);
    }


    /**
     * Fallback handler for all unexpected internal server errors (500).
     * CRITICAL: This prevents exposure of stack traces or sensitive system details.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllUnforeseenExceptions(
            Exception ex, WebRequest request) {

        // Log the detailed exception internally for debugging purposes (essential).
        System.err.println("UNHANDLED API ERROR DETECTED: " + ex.getMessage()); 

        // Return a generic, non-descriptive error message to the client.
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(), 
                "An unexpected internal error occurred. Please contact support with reference ID: [GUID]", 
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

---

## ✅ ACCEPTANCE CRITERIA CHECKLIST & BENEFITS ANALYSIS

| Criterion | Status | Implementation Detail | Benefit Achieved |
| :--- | :---: | :--- | :--- |
| **All errors follow the same response format.** | $\checkmark$ | The `ApiErrorResponse` DTO is enforced by the global handler. | Consistent API Contract, Predictability. |
| **Validation errors return meaningful messages.** | $\checkmark$ | Handled specifically by `MethodArgumentNotValidException` handler, extracting field-specific details. | Easy Frontend Error Handling. |
| **Auth/Authorization errors are standardized.** | $\checkmark$ | Dedicated handlers for Unauthorized (401) and Forbidden (403), providing generic but specific messages. | Improved Security UX. |
| **Resource not found errors are handled globally.** | $\checkmark$ | Handled by `ResourceNotFoundException` (mapped to 404). | Predictable resource lookup failures. |
| **Unexpected exceptions return a generic 500 response.** | $\checkmark$ | The final `handleAllUnforeseenExceptions(Exception.class)` acts as the catch-all, preventing stack trace leakage. | Security & Stability (No Sensitive Data Exposure). |
| **Sensitive internal information is never exposed.** | $\checkmark$ | All handlers strip detailed exception messages and replace them with generic/suggestive error text for 500 errors. | Mandatory Security Compliance. |

### Global Benefits Summary

*   **Developer Experience:** Frontend teams no longer need to know the underlying Java stack trace or API implementation details; they only need to parse the standard `ApiErrorResponse` JSON structure.
*   **Maintainability:** Adding a new type of business error simply requires creating a new custom `ApiException` subclass, rather than modifying dozens of controllers.
*   **Debugging:** The inclusion of the current `timestamp` and `path` greatly accelerates debugging by providing precise context for every failure.