package com.tokenly.backend.security.authflow;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;

public interface AuthFlow {

    AuthResponse login(Application application, UserLoginRequest request);
}
