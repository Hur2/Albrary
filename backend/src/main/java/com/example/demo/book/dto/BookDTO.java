package com.example.demo.book.dto;

import com.example.demo.page.dto.PageDTO;

import java.util.List;

public class BookDTO {
    private Long id;
    private byte[] cover_image;
    private String title;
    private String author;
    private List<PageDTO> pages;

    public BookDTO(Long id, byte[] cover_image, String title, String author, List<PageDTO> pages) {
        this.id = id;
        this.cover_image = cover_image;
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    // 게터와 세터
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getCover_image() {
        return cover_image;
    }

    public void setCover_image(byte[] cover_image) {
        this.cover_image = cover_image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public List<PageDTO> getPages() {
        return pages;
    }

    public void setPages(List<PageDTO> pages) {
        this.pages = pages;
    }
}
