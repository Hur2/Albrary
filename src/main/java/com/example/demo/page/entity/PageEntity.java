package com.example.demo.page.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;
import com.example.demo.book.entity.BookEntity;

@Entity
@Getter
@Setter
@Table(name = "page_table") //내용과 이미지 통으로 받을지 나누어서 받을지 확인해야함
public class PageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false) // 책 페이지별 내용 -> gpt로부터 받아옴
    private String text;

    @Lob
    @Column
    private byte[] content_background; // 책 페이지별 이미지 (base64) -> gpt로부터 받아옴

    @Lob
    @Column
    private byte[] content_drawing; // 책 페이지별 이미지 (base64) -> gpt로부터 받아옴

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonIgnore
    private BookEntity book;
}