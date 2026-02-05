package com.tokenly.backend.security.authflow;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.exception.NotFoundException;
import com.tokenly.backend.repository.AuthConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthFlowResolver {

    private final ApplicationContext context;
    private final AuthConfigRepository authConfigRepository;

    public AuthFlow resolve(Application application) {

        AuthConfig config = authConfigRepository
                .findByApplication(application)
                .orElseThrow(() -> new NotFoundException("Auth config not found"));

        AuthMode mode = config.getAuthMode();

        return context.getBean(mode.name(), AuthFlow.class);
    }
}
