package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.admin.CreateFieldRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.ApplicationField;

import java.util.List;
import java.util.Map;

public interface ApplicationFieldService {

    /**
     * Define a new custom field for the application
     */
    ApplicationField defineField(Application application, CreateFieldRequest request);

    /**
     * Get all fields for an application
     */
    List<ApplicationField> getFieldSchema(Application application);

    /**
     * Validate user custom data against field schema
     * Throws exception if validation fails
     */
    void validateCustomData(Application application, Map<String, Object> customData);

    /**
     * Update field definition
     */
    ApplicationField updateField(Application application, String fieldName, CreateFieldRequest request);

    /**
     * Delete a field
     */
    void deleteField(Application application, String fieldName);
}
