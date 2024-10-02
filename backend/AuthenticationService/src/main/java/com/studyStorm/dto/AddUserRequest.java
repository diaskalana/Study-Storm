package com.studyStorm.dto;

public record AddUserRequest(String firstName,
                             String lastName,
                             String email,
                             String phoneNumber,
                             String password,
                             String confirmPassword,
                             String roles) {
}
