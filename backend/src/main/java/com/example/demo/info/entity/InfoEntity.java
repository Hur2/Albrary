package com.example.demo.info.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "info_table")
public class InfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false) // 질문
    private String question;

    @Column(length = 100, nullable = false) // 답변
    private String answer;

    public InfoEntity(){}

    public InfoEntity(String question, String answer){
        this.question = question;
        this.answer = answer;
    }
}