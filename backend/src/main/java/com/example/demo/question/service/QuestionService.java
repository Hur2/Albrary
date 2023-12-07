package com.example.demo.question.service;

import com.example.demo.question.entity.QuestionEntity;
import com.example.demo.question.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuestionEntity> getAllQuestions() { //모든 page 반환
        return questionRepository.findAll();
    }

    public QuestionEntity getQuestionById(Long id){ //id로 page 반환
        Optional<QuestionEntity> question = questionRepository.findById(id);
        if (question.isPresent()){
            return question.get();
        }

        throw new EntityNotFoundException("값을 찾을 수 없습니다. 존재하지 않는 id : " + id);
    }
}
