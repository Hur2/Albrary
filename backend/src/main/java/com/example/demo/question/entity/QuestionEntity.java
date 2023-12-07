package com.example.demo.question.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "question_table")
public class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false) // 질문 - gpt로부터 받아옴
    private String baseQuestions;

    public QuestionEntity(){}

    public QuestionEntity(String baseQuestion){
        this.baseQuestions = baseQuestions;
    }
}