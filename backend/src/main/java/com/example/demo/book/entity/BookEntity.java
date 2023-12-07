package com.example.demo.book.entity;

//import com.example.demo.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;
import com.example.demo.page.entity.PageEntity;

@Entity
@Getter
@Setter
@Table(name = "book_table")
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column
    private byte[] cover_image; // 책 표지 이미지 (base64) -> gpt로부터 받아옴

    @Column(length = 100, nullable = false) // 책제목 -> gpt로부터 받아옴
    private String title;

    @Column(length = 20, nullable = false) // 책제목 -> gpt로부터 받아옴
    private String author;

    @Column //조회수
    private int viewCount = 0;

    //@Column(length = 50, nullable = false) // 필터태그 ->추후에 개발예정
    //private String filter_tag;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "book", fetch = FetchType.EAGER)
    private List<PageEntity> pages;

    @Column(name = "user_id")
    private Long userId;
}
