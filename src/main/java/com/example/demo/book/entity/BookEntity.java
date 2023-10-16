package com.example.demo.book.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "book_table")
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false) // 책제목 -> gpt로부터 받아옴
    private String title;

    @Column
    private byte[] cover_image; // 책 표지 이미지 (base64) -> gpt로부터 받아옴

    @Column(length = 50, nullable = false) // 필터태그 ->추후에 개발예정
    private String filter_tag;
}
