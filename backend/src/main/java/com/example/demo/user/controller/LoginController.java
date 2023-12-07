package com.example.demo.user.controller;

import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://13.124.203.82")
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
    @CrossOrigin(origins = "http://13.124.203.82")
    //@CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody UserEntity user) {
        Optional<UserEntity> foundUser = userRepository.findByUserId(user.getUserId());

        Map<String, Object> response = new HashMap<>();
        if (!foundUser.isPresent()) {
            response.put("isLogin", "아이디를 잘못 입력하였습니다.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        UserEntity existingUser = foundUser.get();
        if (!existingUser.getUserPassword().equals(user.getUserPassword())) {
            response.put("isLogin", "비밀번호를 잘못 입력하였습니다.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        // 로그인 성공 - 세션에 사용자 ID 저장
        session.setAttribute("userId", existingUser.getId());

        // 사용자 정보 포함하여 반환
        Map<String, String> userInfo = new LinkedHashMap<>();
        userInfo.put("Id", existingUser.getId().toString());
        userInfo.put("userName", existingUser.getUserName());
        userInfo.put("userProfileImage", Integer.toString(existingUser.getUserProfileImage().getValue()));;

        List<Map<String, String>> userInfoList = new ArrayList<>();
        userInfoList.add(userInfo);

        response.put("isLogin", "True");
        response.put("userInfo", userInfoList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @CrossOrigin(origins = "http://13.124.203.82")
    public ResponseEntity<Map<String, String>> logoutUser() {
        // 세션에서 userId 제거
        session.removeAttribute("userId");

        Map<String, String> response = new HashMap<>();
        response.put("isLogout", "True");

        return ResponseEntity.ok(response);
    }
}

