package com.example.demo.question.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "question_table")
public class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false) // 질문 - gpt로부터 받아옴
    private String asking;

    @Column(length = 500, nullable = false) // 선택지들 -> gpt로부터 받아옴
    private String selection;

    @Column(length = 100, nullable = false) // 고른 선택지 -> gpt에게 반환
    private String answer;

}