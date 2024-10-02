package com.studyStorm.service;


import com.studyStorm.dto.AddUserRequest;
import com.studyStorm.dto.ChangePasswordRequest;
import com.studyStorm.dto.UpdateUserRequest;
import com.studyStorm.entity.User;
import com.studyStorm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;




    public String addUser(AddUserRequest addUserRequest) {
        User user = new User();

        if (addUserRequest.firstName() != null && !addUserRequest.firstName().isEmpty()) {
            user.setFirstName(addUserRequest.firstName());

        } else {
            return "First Name is required";
        }

        if (addUserRequest.lastName() != null && !addUserRequest.lastName().isEmpty()) {
            user.setLastName(addUserRequest.lastName());
        } else {
            return "Last Name is required";
        }

        if (addUserRequest.email() != null && !addUserRequest.email().isEmpty()) {
            if (isValidEmail(addUserRequest.email())) {
                user.setEmail(addUserRequest.email());
            } else {
                return "Invalid Email format";
            }
            if (repository.findByEmail(addUserRequest.email()).isPresent()) {
                return "Email already exists";

             }

        } else {
            return "Email is required";
        }

        if (addUserRequest.phoneNumber() != null && !addUserRequest.phoneNumber().isEmpty()) {
            if (isValidPhoneNumber(addUserRequest.phoneNumber())) {
                user.setPhoneNumber(addUserRequest.phoneNumber());
            } else {
                return "Invalid Phone Number format";
            }
        } else {
            return "Phone Number is required";
        }

        if (addUserRequest.password() != null && !addUserRequest.password().isEmpty()) {
            if (addUserRequest.confirmPassword() != null && !addUserRequest.confirmPassword().isEmpty()) {
                if (addUserRequest.password().equals(addUserRequest.confirmPassword())) {
                    user.setPassword(passwordEncoder.encode(addUserRequest.password()));
                } else {
                    return "Password and Confirm Password do not match";
                }
            } else {
                return "Confirm Password is required";
            }
        } else {
            return "Password is required";
        }

        if (addUserRequest.roles() != null && !addUserRequest.roles().isEmpty()) {
            user.setRoles(addUserRequest.roles());
        } else {
            return "Roles is required";
        }

        repository.save(user);
        return "User added successfully";
    }

    // Utility method to validate email address format
    private boolean isValidEmail(String email) {

        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email != null && email.matches(emailRegex);
    }

    // Utility method to validate phone number format
    private boolean isValidPhoneNumber(String phoneNumber) {
        // For simplicity, let's assume a valid phone number contains only digits and is 10 digits long
        return phoneNumber != null && phoneNumber.matches("\\d{10}");
    }




    public User findByEmail(String username) {
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public String updateUser(String email, UpdateUserRequest userInfo) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (userInfo.firstName() != null && !userInfo.firstName().isEmpty()) {
            if (!userInfo.firstName().equals(user.getFirstName())) {
                user.setFirstName(userInfo.firstName());
            }
        }

        if (userInfo.lastName() != null && !userInfo.lastName().isEmpty()) {
            if (!userInfo.lastName().equals(user.getLastName())) {
                user.setLastName(userInfo.lastName());
            }
        }

        if (userInfo.email() != null && !userInfo.email().isEmpty()) {
            if (!userInfo.email().equals(user.getEmail())) {
//                check email is already exist
                if (repository.findByEmail(userInfo.email()).isPresent()) {
                    return "Email already exists";
                }
                if (isValidEmail(userInfo.email())) {
                    user.setEmail(userInfo.email());
                } else {
                    return "Invalid Email format";
                }
            }
        }

        if (userInfo.phoneNumber() != null && !userInfo.phoneNumber().isEmpty()) {
            if (!userInfo.phoneNumber().equals(user.getPhoneNumber())) {
//              check phone number is already exist
                if (repository.findByPhoneNumber(userInfo.phoneNumber()).isPresent()) {
                    return "Phone Number already exists";
                }
                if (isValidPhoneNumber(userInfo.phoneNumber())) {
                    user.setPhoneNumber(userInfo.phoneNumber());
                } else {
                    return "Invalid Phone Number format";
                }
            }

        }

        repository.save(user);
        return "User updated successfully";

    }

    public Iterable<User> getAllUsers() {
        return repository.findAll();
    }

    public String changePassword(String email, ChangePasswordRequest changePasswordRequest) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

//      check current password is required
        if (changePasswordRequest.currentPassword() == null || changePasswordRequest.currentPassword().isEmpty()) {
            return "Current Password is required";
        }

//      check new password is required
        if (changePasswordRequest.newPassword() == null || changePasswordRequest.newPassword().isEmpty()) {
            return "New Password is required";
        }

//      check confirm password is required
        if (changePasswordRequest.confirmPassword() == null || changePasswordRequest.confirmPassword().isEmpty()) {
            return "Confirm Password is required";
        }

//      check current password is correct
        if (!passwordEncoder.matches(changePasswordRequest.currentPassword(), user.getPassword())) {
            return "Current Password is incorrect";
        }

//      check new password and confirm password are same
        if (!changePasswordRequest.newPassword().equals(changePasswordRequest.confirmPassword())) {
            return "New Password and Confirm Password do not match";
        }

//      update password
        repository.updatePassword(email, passwordEncoder.encode(changePasswordRequest.newPassword()));
        return "Password changed successfully";

    }

    public String deleteUser(Integer id) {
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);
            return "User deleted successfully";
        } else {
            return "User not found";
        }
    }
}
