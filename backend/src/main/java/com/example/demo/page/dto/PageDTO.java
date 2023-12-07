package com.example.demo.page.dto;

public class PageDTO {
    private Long id;
    private byte[] content_data;

    public PageDTO(Long id, byte[] content_data) {
        this.id = id;
        this.content_data = content_data;
    }

    // 게터와 세터
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getContent_data() {
        return content_data;
    }

    public void setContent_data(byte[] content_data) {
        this.content_data = content_data;
    }
}
