package com.example.demo.page.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.page.entity.PageEntity;
import com.example.demo.page.service.PageService;

import java.util.List;

@RestController
@RequestMapping("/page")
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

    @GetMapping("/{id}")
    public PageEntity getPageById(@PathVariable Long id){
        return pageService.getPageById(id);
    }
}
