package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;

public interface AuthService {

    AuthResponse login(Application application, UserLoginRequest request);

    AuthResponse refresh(Application application, String refreshToken);

    void requestOtp(Application application, String email);

    void requestMagicLink(Application application, String email);
}
