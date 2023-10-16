package com.example.demo.page.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import  jakarta.persistence.Entity;
import  jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "page_table") //내용과 이미지 통으로 받을지 나누어서 받을지 확인해야함
public class PageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false) // 책 페이지별 내용 -> gpt로부터 받아옴
    private String content;

    @Column
    private byte[] content_image; // 책 페이지별 이미지 (base64) -> gpt로부터 받아옴

}