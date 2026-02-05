package com.tokenly.backend.entity;

import com.tokenly.backend.enums.FieldType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "application_fields",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"application_id", "fieldName"})
        },
        indexes = {
                @Index(name = "idx_app_field_order", columnList = "application_id,displayOrder")
        }
)
@Getter
@Setter
public class ApplicationField extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false, length = 100)
    private String fieldName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private FieldType fieldType;

    @Column(nullable = false)
    private boolean required = false;

    @Column(length = 255)
    private String validationPattern; // Regex for custom validation

    private String defaultValue;

    @Column(nullable = false)
    private int displayOrder = 0;

    @Column(length = 500)
    private String description; // Help text for the field
}
