package com.example.demo.page.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.page.entity.PageEntity;
import com.example.demo.page.service.PageService;
import com.example.demo.book.entity.BookEntity;
import com.example.demo.book.repository.BookRepository;

import java.util.List;

@RestController
@RequestMapping("/page")
@CrossOrigin(origins = "http://13.124.203.82")
public class PageController {

    private final PageService pageService;

    @Autowired
    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping
    public List<PageEntity> getAllPages() {
        return pageService.getAllPages();
    }

    @GetMapping("/{bookId}")
    public List<PageEntity> getPagesByBookId(@PathVariable Long bookId){
        return pageService.getPagesByBookId(bookId);
    }
}
