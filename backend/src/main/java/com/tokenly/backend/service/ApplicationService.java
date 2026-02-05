package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {

    record ApplicationWithApiKey(Application application, String apiKey) {}
    
    ApplicationWithApiKey createApplication(Client client, CreateApplicationRequest request);
    
    List<Application> getApplicationsByClient(Client client);
    
    Application getApplicationById(Client client, UUID id);
    
    Application updateApplication(Client client, UUID id, CreateApplicationRequest request);
    
    void deleteApplication(Client client, UUID id);
}
