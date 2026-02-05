package com.tokenly.backend.dto.request.admin;

import lombok.Data;

@Data
public class UserSearchRequest {
    private String email;
    private String status; // ACTIVE, BLOCKED, PENDING_VERIFICATION
    private Integer page = 0;
    private Integer size = 20;
}
