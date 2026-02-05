package com.tokenly.backend.security.login;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.repository.AuthConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoginHandlerResolver {

    private final ApplicationContext context;
    private final AuthConfigRepository authConfigRepository;

    /**
     * Resolve the correct LoginMethodHandler for the given application
     */
    public LoginMethodHandler resolve(Application application) {
        LoginMethod method = authConfigRepository.findByApplication(application)
                .map(AuthConfig::getLoginMethod)
                .orElse(LoginMethod.PASSWORD); // Default

        return context.getBean(method.name(), LoginMethodHandler.class);
    }
}
