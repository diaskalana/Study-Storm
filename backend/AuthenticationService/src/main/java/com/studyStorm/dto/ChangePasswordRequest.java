package com.studyStorm.dto;

public record ChangePasswordRequest(String currentPassword,
                                     String newPassword,
                                     String confirmPassword) {
}
