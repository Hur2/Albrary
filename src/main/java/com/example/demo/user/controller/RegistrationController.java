package com.example.demo.user.controller;

import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/registration")
public class RegistrationController {

    private final UserRepository userRepository;

    @Autowired
    public RegistrationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserEntity newUser) {
        Map<String, String> response = new HashMap<>();

        // userId 중복 검사
        if (userRepository.findByUserId(newUser.getUserId()).isPresent()) {
            response.put("isSuccess", "중복된 UserId");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 사용자 저장
        userRepository.save(newUser);
        response.put("isSuccess", "True");
        return ResponseEntity.ok(response);
    }
}