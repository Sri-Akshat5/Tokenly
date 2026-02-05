package com.tokenly.backend.dto.request.admin;

import com.tokenly.backend.enums.FieldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateFieldRequest {

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotNull(message = "Field type is required")
    private FieldType fieldType;

    private boolean required = false;

    private String validationPattern;

    private String defaultValue;

    private int displayOrder = 0;

    private String description;
}
