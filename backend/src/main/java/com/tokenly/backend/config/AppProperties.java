package com.tokenly.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Url url = new Url();
    private final Auth auth = new Auth();
    private final Branding branding = new Branding();

    @Data
    public static class Url {
        private String baseBackend = "http://localhost:8084";
        private String baseFrontend = "http://localhost:5173";
    }

    @Data
    public static class Auth {
        private int verificationTokenExpiryHours = 24;
        private int passwordResetTokenExpiryHours = 1;
        private int otpExpiryMinutes = 10;
        private int magicLinkExpiryMinutes = 15;
    }

    @Data
    public static class Branding {
        private String footerText = "Tokenly";
        private String securedByText = "Secured by Tokenly";
    }
}
