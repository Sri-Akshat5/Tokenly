package com.tokenly.backend.security.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ApiKeyGenerator {

    public String generatePublicKey() {
        return "pk_" + UUID.randomUUID();
    }

    public String generateSecretKey() {
        return "sk_" + UUID.randomUUID();
    }
}
