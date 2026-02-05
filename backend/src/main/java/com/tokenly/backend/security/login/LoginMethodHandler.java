package com.tokenly.backend.security.login;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;

public interface LoginMethodHandler {
    
    /**
     * Authenticate a user based on the request data
     * @return Authenticated user
     */
    User authenticate(Application application, UserLoginRequest request);
}
