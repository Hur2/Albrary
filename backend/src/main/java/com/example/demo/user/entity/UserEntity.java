package com.example.demo.user.entity;

import com.example.demo.user.enumer.ProfileImageType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_table")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false) // 아이디
    private String userName;

    @Column(length = 20, nullable = false) //비밀번호
    private String userId;

    @Column(length = 20, nullable = false) // 이름
    private String userPassword;

    @Enumerated(EnumType.STRING)
    private ProfileImageType userProfileImage; // 프로필 이미지 : 0 1 2 3 4
}

