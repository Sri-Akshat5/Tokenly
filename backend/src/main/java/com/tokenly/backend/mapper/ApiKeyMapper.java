package com.tokenly.backend.mapper;

import com.tokenly.backend.dto.responce.application.ApiKeyResponse;
import com.tokenly.backend.entity.ApiKey;
import org.springframework.web.bind.annotation.Mapping;


public interface ApiKeyMapper {

    ApiKeyResponse toResponse(ApiKey apiKey);
}
