package com.example.demo;

import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import com.example.demo.book.controller.BookController;
import com.example.demo.book.entity.BookEntity;
import com.example.demo.book.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.List;

class CreateBook {
    private MockMvc mockMvc;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks // auto inject bookRepository
    private BookController bookController;

    // This setup needs to be run before the tests, it will set up the MockMvc object with the BookController.
    @BeforeEach
    public void setup(WebApplicationContext context) {
        mockMvc = MockMvcBuilders
                .standaloneSetup(bookController)
                .build();
    }

    @Test
    public void testCreateBook() throws Exception {
        // Given
        BookEntity bookEntity = new BookEntity(); // Assume this is your entity with getters and setters
        bookEntity.setTitle("Test Book");
        given(bookRepository.save(any(BookEntity.class))).willReturn(bookEntity);

        // When & Then
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"title\": \"Test Book\" }")) // Use an object mapper to convert your entity to JSON string
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Book"));
    }

}
