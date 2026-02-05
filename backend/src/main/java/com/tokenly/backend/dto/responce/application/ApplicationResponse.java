package com.tokenly.backend.dto.responce.application;

import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ApplicationResponse {

    private final UUID id;
    private final String appName;
    private final ApplicationEnvironment environment;
    private final ApplicationStatus status;
    private final Long userCount;
}
