package com.example.demo.question.controller;

import com.example.demo.question.entity.QuestionEntity;
import com.example.demo.question.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
@CrossOrigin(origins = "http://13.124.203.82")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<QuestionEntity> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public QuestionEntity getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }
}
