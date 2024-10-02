package com.studyStorm.repository;

import com.studyStorm.entity.ForgotPassword;
import com.studyStorm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {

    @Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
    Optional<ForgotPassword> findByOptAndUser(Integer otp, User user);

}
