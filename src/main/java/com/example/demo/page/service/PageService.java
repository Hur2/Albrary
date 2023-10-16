package com.example.demo.page.service;

import com.example.demo.book.repository.BookRepository;
import com.example.demo.page.repository.PageRepository;
import com.example.demo.question.repository.QuestionRepository;
import com.example.demo.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.page.entity.PageEntity;

import java.util.List;

@Service
public class PageService {

    private final PageRepository pageRepository;

    @Autowired
    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public List<PageEntity> getAllPages() { //모든 page 반환
        return pageRepository.findAll();
    }

    public PageEntity getPageById(Long id){ //id로 page 반환
        Optional<PageEntity> page = pageRepository.findById(id);
        if (page.isPresent()){
            return page.get();
        }
        throw new EntityNotFoundException("값을 찾을 수 없습니다. 존재하지 않는 id : " + id);
    }
}
