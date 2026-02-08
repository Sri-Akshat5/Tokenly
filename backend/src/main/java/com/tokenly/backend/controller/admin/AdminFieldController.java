package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.admin.CreateFieldRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.ApplicationField;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.service.ApplicationFieldService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin/{applicationId}/fields")
@RequiredArgsConstructor
public class AdminFieldController {

    private final ApplicationFieldService fieldService;
    private final ApplicationRepository applicationRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationField>> createField(
            HttpServletRequest request,
            @PathVariable UUID applicationId,
            @Valid @RequestBody CreateFieldRequest fieldRequest
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin creating custom field: {} for application: {}", fieldRequest.getFieldName(), application.getAppName());
        ApplicationField field = fieldService.defineField(application, fieldRequest);
        return ResponseEntity.ok(ApiResponse.success("Field created successfully", field));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationField>>> listFields(
            HttpServletRequest request,
            @PathVariable UUID applicationId
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin fetching custom fields for application: {}", application.getAppName());
        List<ApplicationField> fields = fieldService.getFieldSchema(application);
        return ResponseEntity.ok(ApiResponse.success(fields));
    }

    @PutMapping("/{fieldName}")
    public ResponseEntity<ApiResponse<ApplicationField>> updateField(
            HttpServletRequest request,
            @PathVariable UUID applicationId,
            @PathVariable String fieldName,
            @Valid @RequestBody CreateFieldRequest fieldRequest
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin updating field: {} for application: {}", fieldName, application.getAppName());
        ApplicationField field = fieldService.updateField(application, fieldName, fieldRequest);
        return ResponseEntity.ok(ApiResponse.success("Field updated successfully", field));
    }

    @DeleteMapping("/{fieldName}")
    public ResponseEntity<ApiResponse<?>> deleteField(
            HttpServletRequest request,
            @PathVariable UUID applicationId,
            @PathVariable String fieldName
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin deleting field: {} from application: {}", fieldName, application.getAppName());
        fieldService.deleteField(application, fieldName);
        return ResponseEntity.ok(ApiResponse.success("Field deleted successfully", null));
    }
    
    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }

    private Application getAndVerifyApplication(Client client, UUID applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ForbiddenException("Application not found"));
        
        if (!application.getClient().getId().equals(client.getId())) {
            throw new ForbiddenException("You don't have access to this application");
        }
        
        return application;
    }
}
