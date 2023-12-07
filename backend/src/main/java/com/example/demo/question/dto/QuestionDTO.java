package com.example.demo.question.dto;

public class QuestionDTO {
    private String baseQuestion;

    public QuestionDTO() {}

    public QuestionDTO(String baseQuestion) {
        this.baseQuestion = baseQuestion;
    }

    public String getBaseQuestion() {
        return baseQuestion;
    }

    public void setBaseQuestion(String baseQuestion) {
        this.baseQuestion = baseQuestion;
    }
}
