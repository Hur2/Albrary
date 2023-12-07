package com.example.demo.book.dto;
import java.util.Arrays;

public class BookSimpleDTO {
    private Long id;

    private byte[] cover_image;
    private String title;
    private String author;

    public BookSimpleDTO(Long id, byte[] cover_image, String title, String author) {
        this.id = id;
        this.cover_image = cover_image;
        this.title = title;
        this.author = author;
    }

    // 게터와 세터 메소드들
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public byte[] getCover_image() {
        return cover_image;
    }

    public void setCover_Image(byte[] cover_image) {
        this.cover_image = cover_image;
    }

    @Override
    public String toString() {
        return "BookSimpleDTO{" +
                "id=" + id +
                ", cover_image=" + Arrays.toString(cover_image) +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}
