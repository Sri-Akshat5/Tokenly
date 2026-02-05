package com.tokenly.backend.mapper;

import com.tokenly.backend.dto.responce.application.ApplicationResponse;
import com.tokenly.backend.entity.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationMapper {

    private final com.tokenly.backend.repository.UserRepository userRepository;

    public ApplicationResponse toResponse(Application application) {
        if (application == null) {
            return null;
        }

        return ApplicationResponse.builder()
                .id(application.getId())
                .appName(application.getAppName())
                .environment(application.getEnvironment())
                .status(application.getStatus())
                .userCount(userRepository.countByApplication(application))
                .build();
    }
}
