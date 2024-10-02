package com.studyStorm.service;

import com.studyStorm.entity.RefreshToken;
import com.studyStorm.repository.RefreshTokenRepository;
import com.studyStorm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public RefreshToken createRefreshToken(String username) {
      RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findByEmail(username).get())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(2*60*60))//2 hours
                .build();

        return refreshTokenRepository.save(refreshToken);

    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh Token was expired. Please make a new signin request");
        }
        return token;
    }
}
