package com.tokenly.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class OpenApiConfig {

    private final AppProperties appProperties;

    @Bean
    public OpenAPI tokenlyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Tokenly Auth API")
                        .description("Complete Authentication-as-a-Service Platform with Custom Fields, API Key Management, and Production Features")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Tokenly Team")
                                .email("support@tokenly.codes")
                                .url("https://tokenly.codes"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url(appProperties.getUrl().getBaseBackend())
                                .description("Dynamic API Server")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("API Key"))
                .components(new Components()
                        .addSecuritySchemes("API Key",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-API-Key")
                                        .description("API Key for application authentication"))
                        .addSecuritySchemes("Bearer Token",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token for user authentication")));
    }
}
