package com.tokenly.backend.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class UserSignupRequest {

    @Email
    @NotBlank
    private String email;

    private String password;

    // dynamic fields
    private Map<String, Object> customData = new HashMap<>();

    @JsonAnySetter
    public void addCustomField(String name, Object value) {
        if (customData == null) {
            customData = new HashMap<>();
        }
        customData.put(name, value);
    }

    @JsonAnyGetter
    public Map<String, Object> getCustomData() {
        return customData;
    }
}
