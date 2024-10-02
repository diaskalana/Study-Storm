package com.studyStorm.controller;

import com.studyStorm.dto.ChangePassword;
import com.studyStorm.dto.MailBody;
import com.studyStorm.entity.ForgotPassword;
import com.studyStorm.entity.User;
import com.studyStorm.repository.ForgotPasswordRepository;
import com.studyStorm.repository.UserRepository;
import com.studyStorm.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;

@RestController
@CrossOrigin
@RequestMapping("/forgotPassword")
public class ForgotPasswordController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordController(UserRepository userRepository, EmailService emailService, ForgotPasswordRepository forgotPasswordRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.forgotPasswordRepository = forgotPasswordRepository;

        this.passwordEncoder = passwordEncoder;
    }

//    send mail for email verification
    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyMail(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        int otp = otpGenerator();
        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("This is the OTP for the request :" + otp)
                .subject("OTP for forgot password")
                .build();

        ForgotPassword forgotPassword = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis()+70*1000)) // 70 seconds
                .user(user)
                .build();

        emailService.sendSimpleMessage(mailBody);
        forgotPasswordRepository.save(forgotPassword);
        return ResponseEntity.ok("Mail sent successfully");

    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
       User user = userRepository.findByEmail(email)
               .orElseThrow(() -> new RuntimeException("Please enter valid email"));

         ForgotPassword forgotPassword = forgotPasswordRepository.findByOptAndUser(otp, user)
                 .orElseThrow(() -> new RuntimeException("Please enter valid otp"));

            if(forgotPassword.getExpirationTime().before(Date.from(Instant.now()))) {
                forgotPasswordRepository.deleteById(forgotPassword.getFpid());
                return new ResponseEntity<>("OTP expired", HttpStatus.EXPECTATION_FAILED);
            }

            return ResponseEntity.ok("OTP verified successfully");

    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePassword(@RequestBody ChangePassword changePassword,
                                                 @PathVariable String email) {
        if (!Objects.equals(changePassword.password(), changePassword.confirmPassword())) {
            return new ResponseEntity<>("Password and confirm password should be same", HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = passwordEncoder.encode(changePassword.password());
        userRepository.updatePassword(email, encodedPassword);
        return ResponseEntity.ok("Password changed successfully");

    }


    private Integer otpGenerator() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }

}
