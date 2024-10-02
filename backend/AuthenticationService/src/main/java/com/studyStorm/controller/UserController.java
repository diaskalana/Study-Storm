package com.studyStorm.controller;

import com.studyStorm.dto.*;
import com.studyStorm.entity.RefreshToken;
import com.studyStorm.entity.User;
import com.studyStorm.service.JwtService;
import com.studyStorm.service.RefreshTokenService;
import com.studyStorm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/v1")
public class UserController {

    @Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @GetMapping("/home")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

//    get all users
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/users/all")
    public Iterable<User> getAllUsers(){
        return service.getAllUsers();
    }


    @PostMapping("/new")
    public String addNewUser(@RequestBody AddUserRequest userInfo){
        return service.addUser(userInfo);
    }

//    update user by email
    @PatchMapping("/user/{email}")
    public String updateUser(@PathVariable String email, @RequestBody UpdateUserRequest userInfo){
        return service.updateUser(email, userInfo);
    }

//    change password by email
    @PatchMapping("/user/userProfile/updatePassword/{email}")
    public String changePassword(@PathVariable String email, @RequestBody ChangePasswordRequest changePasswordRequest){
        return service.changePassword(email, changePasswordRequest);
    }

//    delete user by id
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Integer id){
        return service.deleteUser(id);
    }



    @PostMapping("/auth/admin/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String addNewUserByAdmin(@RequestBody AddUserRequest userInfo){
        return service.addUser(userInfo);
    }

    @PostMapping("/login")
    public JwtResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        User user = service.findByEmail(authRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername()
                , authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequest.getUsername());
            jwtService.generateToken(authRequest.getUsername(), user.getRoles());
            return JwtResponse.builder()
                    .accessToken(jwtService.generateToken(authRequest.getUsername(), user.getRoles()))
                    .token(refreshToken.getToken())
                    .build();
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }

    }

//    get user details from token
    @GetMapping("/user")
    public User getUserDetails(@RequestHeader("Authorization") String token) {
        return service.findByEmail(jwtService.getEmailFromToken(token));
    }

    //    get user details from email
    @GetMapping("/user/{email}")
    // @PreAuthorize("hasAuthority('ROLE_INSTRUCTOR')")
    public User getUserDetailsByEmail(@PathVariable String email) {
        return service.findByEmail(email);
    }



    @PostMapping("/refreshToken")
    public JwtResponse refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.getToken())
                  .map(refreshTokenService::verifyExpiration)
                  .map(RefreshToken::getUser)
                  .map(user -> {
                      String accessToken = jwtService.generateToken(user.getEmail(), user.getRoles());
                        return JwtResponse.builder()
                                .accessToken(accessToken)
                                .token(refreshTokenRequest.getToken())
                                .build();
                  }).orElseThrow(() -> new RuntimeException("Invalid refresh Token"));
    }


}



