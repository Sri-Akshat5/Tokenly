package com.tokenly.backend.dto.request.application;

import com.tokenly.backend.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ToggleApplicationStatusRequest {
    
    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}
