package com.tokenly.backend.service.impl;

import com.tokenly.backend.dto.request.admin.CreateFieldRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.ApplicationField;
import com.tokenly.backend.enums.FieldType;
import com.tokenly.backend.repository.ApplicationFieldRepository;
import com.tokenly.backend.service.ApplicationFieldService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationFieldServiceImpl implements ApplicationFieldService {

    private final ApplicationFieldRepository fieldRepository;
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    @Override
    public ApplicationField defineField(Application application, CreateFieldRequest request) {
        log.info("Defining new field '{}' for application: {}", request.getFieldName(), application.getAppName());

        if (fieldRepository.existsByApplicationAndFieldName(application, request.getFieldName())) {
            throw new IllegalStateException("Field already exists: " + request.getFieldName());
        }

        ApplicationField field = new ApplicationField();
        field.setApplication(application);
        field.setFieldName(request.getFieldName());
        field.setFieldType(request.getFieldType());
        field.setRequired(request.isRequired());
        field.setValidationPattern(request.getValidationPattern());
        field.setDefaultValue(request.getDefaultValue());
        field.setDisplayOrder(request.getDisplayOrder());
        field.setDescription(request.getDescription());

        ApplicationField saved = fieldRepository.save(field);
        log.info("Field '{}' defined successfully with type: {}", request.getFieldName(), request.getFieldType());
        return saved;
    }

    @Override
    public List<ApplicationField> getFieldSchema(Application application) {
        return fieldRepository.findByApplicationOrderByDisplayOrder(application);
    }

    @Override
    public void validateCustomData(Application application, Map<String, Object> customData) {
        if (customData == null) {
            customData = Map.of();
        }

        List<ApplicationField> fields = getFieldSchema(application);
        log.debug("Validating custom data against {} field definitions", fields.size());

        for (ApplicationField field : fields) {
            Object value = customData.get(field.getFieldName());

            // Check required fields
            if (field.isRequired() && (value == null || value.toString().isBlank())) {
                throw new IllegalArgumentException("Required field missing: " + field.getFieldName());
            }

            // Skip validation if field is not present (and not required)
            if (value == null) {
                continue;
            }

            // Validate based on field type
            validateFieldValue(field, value);
        }

        log.debug("Custom data validation passed");
    }

    @Override
    public ApplicationField updateField(Application application, String fieldName, CreateFieldRequest request) {
        log.info("Updating field '{}' for application: {}", fieldName, application.getAppName());

        ApplicationField field = fieldRepository.findByApplicationAndFieldName(application, fieldName)
                .orElseThrow(() -> new IllegalStateException("Field not found: " + fieldName));

        field.setFieldType(request.getFieldType());
        field.setRequired(request.isRequired());
        field.setValidationPattern(request.getValidationPattern());
        field.setDefaultValue(request.getDefaultValue());
        field.setDisplayOrder(request.getDisplayOrder());
        field.setDescription(request.getDescription());

        return fieldRepository.save(field);
    }

    @Override
    public void deleteField(Application application, String fieldName) {
        log.info("Deleting field '{}' from application: {}", fieldName, application.getAppName());
        fieldRepository.deleteByApplicationAndFieldName(application, fieldName);
    }

    private void validateFieldValue(ApplicationField field, Object value) {
        String stringValue = value.toString();

        switch (field.getFieldType()) {
            case STRING:
                // Apply custom regex if provided
                if (field.getValidationPattern() != null && !field.getValidationPattern().isBlank()) {
                    if (!Pattern.matches(field.getValidationPattern(), stringValue)) {
                        throw new IllegalArgumentException(
                                "Field '" + field.getFieldName() + "' does not match pattern: " + field.getValidationPattern()
                        );
                    }
                }
                break;

            case NUMBER:
                try {
                    Double.parseDouble(stringValue);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Field '" + field.getFieldName() + "' must be a number");
                }
                break;

            case BOOLEAN:
                if (!stringValue.equalsIgnoreCase("true") && !stringValue.equalsIgnoreCase("false")) {
                    throw new IllegalArgumentException("Field '" + field.getFieldName() + "' must be true or false");
                }
                break;

            case DATE:
                try {
                    LocalDate.parse(stringValue, DateTimeFormatter.ISO_DATE);
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Field '" + field.getFieldName() + "' must be a valid date (YYYY-MM-DD)");
                }
                break;

            case EMAIL:
                if (!Pattern.matches(EMAIL_PATTERN, stringValue)) {
                    throw new IllegalArgumentException("Field '" + field.getFieldName() + "' must be a valid email");
                }
                break;

            case URL:
                try {
                    new URL(stringValue);
                } catch (MalformedURLException e) {
                    throw new IllegalArgumentException("Field '" + field.getFieldName() + "' must be a valid URL");
                }
                break;
        }
    }
}
