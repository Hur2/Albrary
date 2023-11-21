package com.example.demo.user.controller;

import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UserRepository userRepository;
    private final HttpSession session;

    @Autowired
    public LoginController(UserRepository userRepository, HttpSession session) {
        this.userRepository = userRepository;
        this.session = session;
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody UserEntity user) {
        Optional<UserEntity> foundUser = userRepository.findByUserId(user.getUserId());

        Map<String, Object> response = new HashMap<>();
        if (!foundUser.isPresent()) {
            response.put("isLogin", "없는 userId");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        UserEntity existingUser = foundUser.get();
        if (!existingUser.getUserPassword().equals(user.getUserPassword())) {
            response.put("isLogin", "틀린 userPassword");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 로그인 성공 - 세션에 사용자 ID 저장
        session.setAttribute("userId", existingUser.getId());

        // 사용자 정보 포함하여 반환
        Map<String, String> userInfo = new LinkedHashMap<>();
        userInfo.put("Id", existingUser.getId().toString());
        userInfo.put("userName", existingUser.getUserName());
        userInfo.put("userId", existingUser.getUserId());
        userInfo.put("userPassword", existingUser.getUserPassword());
        userInfo.put("profile_image", Integer.toString(existingUser.getProfile_image().getValue()));;

        List<Map<String, String>> userInfoList = new ArrayList<>();
        userInfoList.add(userInfo);

        response.put("isLogin", "True");
        response.put("userInfo", userInfoList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logoutUser() {
        // 세션에서 userId 속성 제거
        session.removeAttribute("userId");

        Map<String, String> response = new HashMap<>();
        response.put("isLogout", "True");

        return ResponseEntity.ok(response);
    }
}

